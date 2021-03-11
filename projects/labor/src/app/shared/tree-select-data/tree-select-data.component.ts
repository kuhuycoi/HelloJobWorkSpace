import { Component, OnInit, Input, Inject, ViewChildren, ViewChild, QueryList, Output, EventEmitter } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FormControl } from '@angular/forms';
import { WebsiteModule } from 'projects/tools/src/lib/types/website-module';

@Component({
  selector: 'app-tree-select-data',
  templateUrl: './tree-select-data.component.html',
  styleUrls: ['./tree-select-data.component.scss']
})
export class TreeSelectDataComponent implements OnInit {
  @Input() label: string;
  @Input() data = [];
  @Input() property: FormControl;
  @Output() private change = new EventEmitter<any>();

  constructor(
    private dialog: MatDialog
  ) {
  }

  text = "Chọn nhóm ngành nghề";
  ngOnInit(): void {
    this.change.emit(this.property);
    this.buildText();
  }
  buildText() {
    let text = '';
    if (this.data && this.property.value) {
      this.data.forEach(element => {
        this.property.value.forEach(id => {
          if (element.id === id) {
            text += element.name + ', ';
          }
        });
      });
    }
    return text ? (this.text = text) : this.text;
  }
  changeCareer() {
    const diaglogRef = this.dialog.open(TreeSelectDataDialogComponent, {
      width: '60%',
      height: '80%',
      maxHeight: '100%',
      panelClass: 'full-width-dialog',
      data: {
        data: this.data,
        selectedIDs: this.property.value
      }
    });
    diaglogRef.afterClosed().subscribe(data => {
      if (data) {
        // this.selectedIDsOut = data;
        this.text = data.text.join(', ');
        this.property.setValue(data.value);
        this.change.emit(this.property);
      }
    });
  }

  getError(control) {
    if (control.hasError('required')) {
      return 'Vui lòng nhập trường này';
    } else if (control.hasError('pattern')) {
      return 'Không đúng định dạng';
    } else {
      return 'Vui lòng nhập lại';
    }
  }

}

@Component({
  selector: 'app-tree-select-data-dialog',
  templateUrl: './tree-select-data-dialog.component.html',
  styleUrls: ['./tree-select-data-dialog.component.scss']
})
export class TreeSelectDataDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TreeSelectDataDialogComponent>
  ) {
    this.TREE_DATA = data.data;
    if (data.selectedIDs) {
      this.selectedIDs = data.selectedIDs;
    }
  }


  TREE_DATA = [];
  selectedIDs = [];
  treeControl = new NestedTreeControl<WebsiteModule>(node => node.children);
  @ViewChildren('moduleID') moduleIDs: QueryList<MatCheckbox>;
  dataSource = new MatTreeNestedDataSource<WebsiteModule>();
  @ViewChild('tree', { static: true }) tree;

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this.dataSource.data = this.data.data;
    const sourceData = this.buildTreeData(1);
    this.dataSource.data = sourceData;
    this.treeControl.dataNodes = sourceData;
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.tree.treeControl.expandAll();
  }
  private buildTreeData(parentId: number): any[] {
    const childrens = this.TREE_DATA.filter(leaf => {
      return leaf.parentId === parentId || (leaf.parentId && leaf.parentID.id === parentId);
    });
    childrens.forEach(leaf => {
      leaf.children = this.buildTreeData(leaf.id);
    });
    return childrens;
  }

  private transformer = (node: WebsiteModule, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      // tslint:disable-next-line: object-literal-shorthand
      level: level,
    };
  }

  hasChild = (_: number, node: WebsiteModule) => !!node.children && node.children.length > 0;

  getChecked(id: number) {
    return this.selectedIDs.indexOf(id) >= 0;
  }

  save() {
    const ids = [];
    const texts = [];
    this.moduleIDs.forEach(checkbox => {
      if (checkbox.checked) {
        ids.push(checkbox.id);
        if (checkbox.value) {
          texts.push(checkbox.value);
        }
      }
    });
    const dataRef = { value: ids, text: texts };
    this.dialogRef.close(dataRef);
  }
}

