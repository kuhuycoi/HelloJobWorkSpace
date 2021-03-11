import { Component, OnInit, Input } from '@angular/core';
import { QuickPostFormGroup } from 'projects/tools/src/lib/types/quick-post-form-group';
@Component({
  selector: 'app-quick-post',
  templateUrl: './quick-post.component.html',
  styleUrls: ['./quick-post.component.scss']
})
export class QuickPostComponent implements OnInit {
  formGroup = new QuickPostFormGroup();
  constructor() { }

  ngOnInit(): void {
    console.log(this.formGroup.formControlNames);
    
  }
}
