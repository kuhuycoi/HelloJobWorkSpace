import { FormGroup } from "@angular/forms";
import { QuickPostFormControl } from "./quick-post-form-control";

export class QuickPostFormGroup extends FormGroup {
    constructor() {
        const controls: any = {};
        const factoryName = new QuickPostFormControl(null);
        factoryName.title = 'Tên công ty';
        factoryName.hint = 'Đây là cách tên công ty của bạn hiển thị trên Hello Job';
        controls.factoryName = factoryName;
        const contractDate = new QuickPostFormControl(null);
        contractDate.title = 'Hạn ứng tuyển';
        contractDate.hint = 'Đây là thời gian cuối cùng mà ứng viên có thể nộp hồ sơ ứng tuyển';
        contractDate.questionType = 'DATE';
        controls.contractDate = contractDate;
        super(controls);
    }
    get formControlNames() {
        return Object.keys(this.controls);
    }
    get formControls() {
        return Object.values(this.controls);
    }
}
