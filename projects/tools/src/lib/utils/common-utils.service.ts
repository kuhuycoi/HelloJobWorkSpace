
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { UserPermission } from '@app/core/models';
import { FormGroup, FormArray, FormControl, } from '@angular/forms';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CommonUtils {
  public static isNullOrEmpty(str: any): boolean {
    return !str || (str + '').trim() === '';
  }
  public static isValidId(id: any): boolean {
    if (CommonUtils.isNullOrEmpty(id)) {
      return false;
    }
    if (id === '0') {
      return false;
    }
    return true;
  }
  public static isRealNumber(num: any): boolean {
    if (CommonUtils.isNullOrEmpty(num)) {
      return false;
    }
    if (num === '0' || num === 0) {
      return false;
    }
    return true;
  }
  public static tctReplaceAll(text: string, code: string, decode: string) {
    let old_text = text;
    do {
      old_text = text;
      text = text.replace(code, decode);
    } while (old_text !== text);
    return text;
  }
  public static trim(text: string) {
    if (text == null) {
      return text;
    }
    return text.trim();
  }
  /**
   * return 1 if num1 > num2
   * return 0 if num2 === num2
   * return -1 if num1 < num2
   */
  public static compareNumber(num1: any, num2: any): number {
    return parseFloat(num1) > parseFloat(num2) ? 1 : (parseFloat(num1) === parseFloat(num2) ? 0 : -1);
  }
  /**
   * getPermissionCode
   * @param code: string
   */
  // public static getPermissionCode(code: string): string {
  //   return PERMISSION_CODE[code] || '';
  // }
  /**
   * has Permission
   */
  // public static havePermission(operationKey: string, adResourceKey: string): boolean {
  //   const permissionCode = this.getPermissionCode(operationKey) + ' ' + this.getPermissionCode(adResourceKey);
  //   const userInfo = HrStorage.getUserToken();
  //   if (userInfo == null) {
  //     return false;
  //   }

  //   if (!userInfo.userId) {
  //     return false;
  //   }

  //   const userPermissionList: UserPermission[] = userInfo.userPermissionList;
  //   if (userPermissionList == null || userPermissionList.length <= 0) {
  //     return false;
  //   }

  //   for (const userPermission of userPermissionList) {
  //     const check = userPermission.operationCode + ' ' + userPermission.resourceCode;
  //     if (check === permissionCode) {
  //       return true;
  //     }
  //   }

  //   return false;
  // }
  /**
   * copyProperties
   * param dest
   * param orgs
   */
  public static copyProperties(dest: any, orig: any): any {
    if (!orig) {
      return dest;
    }

    for (const k in dest) {
      if (orig.hasOwnProperty(k)) {
        dest[k] = orig[k];
      }
    }
    return dest;
  }
  /**
   * Clone all properties from source and save typeof dest
   * Author:huynq
   * @param source :object Source
   */
  public static cloneObject(dest: any, source: any): any {
    if (!source) {
      return dest;
    }
    for (const attribute in source) {
      if (source[attribute] !== undefined) {
        if (source[attribute] === null) {
          dest[attribute] = null;
        } else if (typeof source[attribute] === 'object') {
          dest[attribute] = Object.assign({}, source[attribute]);
        } else {
          dest[attribute] = source[attribute];
        }
      }
    }
    return dest;
  }

  /**
   * copyProperties
   * param dest
   * param orgs
   */
  public static buildParams(obj: any): HttpParams {
    return Object.entries(obj || {})
      .reduce((params, [key, value]) => {
        if (typeof value === 'undefined' || value === null) {
          return params;
        } else if (moment.isMoment(value)) {
          return params.set(key, value.toDate().toDateString());
        } else if (typeof value === typeof {}) {
          return params.set(key, JSON.stringify(value));
        } else {
          return params.set(key, String(value));
        }
      }, new HttpParams());
  }
  /**
   * validateForm
   * @param form: FormGroup
   */
  public static isValidForm(form: any): boolean {
    this.markAsTouched(form);
    if (form.invalid) {
      setTimeout(() => {
        CommonUtils.scrollToSmoothly('.errorMessageDiv.show');
      }, 200);
    }
    return !form.invalid;
  }

  public static isValidFormAndValidity(form: any): boolean {
    this.markAsTouchedAndValidity(form);
    return !form.invalid;
  }

  public static markAsTouched(form: any) {
    if (form instanceof FormGroup) {
      CommonUtils.isValidFormGroup(form);
    } else if (form instanceof FormArray) {
      CommonUtils.isValidFormArray(form);
    } else if (form instanceof FormControl) {
      form.markAsTouched({ onlySelf: true });
      if (form.invalid) {
        console.warn('Validate error field:', form);
      }
    }
  }
  public static offset(el): any {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }
  public static scrollToSmoothly(querySelectorAll, time?) {
    const elements = document.querySelectorAll(querySelectorAll);
    if (!elements) {
      return;
    }
    const first = elements[0];
    const position = CommonUtils.offset(first);
    if (isNaN(position.top)) {
      console.warn('Position must be a number');
      return;
    }
    if (position.top < 0) {
      console.warn('Position can not be negative');
      return;
    }
    let top = position.top - 100;
    const currentPos = window.scrollY || window.screenTop;
    if (currentPos > position.top) {
      top = position.top + 100;
    }
    try {
      window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, top);
    }
  }

  /**
   * markAsTouchedAndValidity
   */
  public static markAsTouchedAndValidity(form: any) {
    if (form instanceof FormGroup) {
      CommonUtils.isValidFormGroupAndValidity(form);
    } else if (form instanceof FormArray) {
      CommonUtils.isValidFormArrayAndValidity(form);
    } else if (form instanceof FormControl) {
      form.updateValueAndValidity(); // t???m b??? sung ng??y 28/03/2019, tr?????ng h???p validate nh???p 1 th?? b???t bu???c nh???p c??c tr?????ng c??n l???i
      form.markAsTouched({ onlySelf: true });
      if (form.invalid) {
        console.warn('Validate error field:', form);
      }
    }
  }
  public static isValidFormArrayAndValidity(form: FormArray) {
    if (form['isHidden'] === true) {// neu form ??ang b??? ???n th?? kh??ng c???n validate
      return;
    }
    for (const i in form.controls) {
      CommonUtils.markAsTouchedAndValidity(form.controls[i]); // neu form ??ang b??? ???n th?? kh??ng c???n validate
    }
  }

  public static isValidFormArray(form: FormArray) {
    if (form['isHidden'] === true) {// neu form ??ang b??? ???n th?? kh??ng c???n validate
      return;
    }
    for (const i in form.controls) {
      CommonUtils.markAsTouched(form.controls[i]); // neu form ??ang b??? ???n th?? kh??ng c???n validate
    }
  }
  public static isValidFormGroup(form: FormGroup) {
    if (form['isHidden'] === true) {
      return;
    }
    Object.keys(form.controls).forEach(key => {
      CommonUtils.markAsTouched(form.get(key));
    });
  }
  public static isValidFormGroupAndValidity(form: FormGroup) {
    if (form['isHidden'] === true) {
      return;
    }
    Object.keys(form.controls).forEach(key => {
      CommonUtils.markAsTouchedAndValidity(form.get(key));
    });
  }




  /**
   * h??m x??? l?? l???y nationId hi???n t???i theo qu???c gia
   */
  public static toTreeNode(res: any): any {
    for (const node of res) {
      if (!node.leaf) {
        delete node.icon;
        if (node.children && node.children.length > 0) {
          node.children = CommonUtils.toTreeNode(node.children);
        }
      }
    }
    return res;
  }
  /**
   * nvl
   * param value
   * param defaultValue
   */
  public static nvl(value: any, defaultValue: number = 0): number {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    return value;
  }
  /**
   * convert To FormData mutilpart request post
   */
  public static convertFormFile(dataPost: any): FormData {
    const filteredData = CommonUtils.convertData(dataPost);
    const formData = CommonUtils.objectToFormData(filteredData, '', []);
    return formData;
  }
  /**
   * objectToFormData
   */
  public static objectToFormData(obj, rootName, ignoreList): FormData {
    const formData = new FormData();
    function appendFormData(data, root) {
      if (!ignore(root)) {
        root = root || '';
        if (data instanceof File) {
          if (data.type !== 'vhr_stored_file') {
            formData.append(root, data);
          }
        } else if (Array.isArray(data)) {
          let index = 0;
          for (let i = 0; i < data.length; i++) {
            if (data[i] instanceof File) {
              if (data[i].type !== 'vhr_stored_file') {
                appendFormData(data[i], root + '[' + index + ']');
                index++;
              }
            } else {
              appendFormData(data[i], root + '[' + i + ']');
            }
          }
        } else if (data && typeof data === 'object') {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              if (root === '') {
                appendFormData(data[key], key);
              } else {
                appendFormData(data[key], root + '.' + key);
              }
            }
          }
        } else {
          if (data !== null && typeof data !== 'undefined') {
            formData.append(root, data);
          }
        }
      }
    }

    function ignore(root) {
      return Array.isArray(ignoreList) && ignoreList.some(function (x) { return x === root; });
    }

    appendFormData(obj, rootName);
    return formData;
  }
  /**
   * convertData
   */
  public static convertData(data: any): any {
    if (typeof data === typeof {}) {
      return CommonUtils.convertDataObject(data);
    } else if (typeof data === typeof []) {
      return CommonUtils.convertDataArray(data);
    } else if (typeof data === typeof true) {
      return CommonUtils.convertBoolean(data);
    }
    return data;
  }
  /**
   * convertDataObject
   * param data
   */
  public static convertDataObject(data: Object): Object {
    if (data) {
      for (const key in data) {
        if (data[key] instanceof File) {

        } else {
          data[key] = CommonUtils.convertData(data[key]);
        }
      }
    }
    return data;
  }
  public static convertDataArray(data: Array<any>): Array<any> {
    if (data && data.length > 0) {
      for (const i in data) {
        data[i] = CommonUtils.convertData(data[i]);
      }
    }
    return data;
  }
  public static convertBoolean(value: Boolean): number {
    return value ? 1 : 0;
  }
  /**
   * tctGetFileSize
   * param files
   */
  public static tctGetFileSize(files) {
    try {
      let fileSize;
      // if (typeof files === typeof []) {
      //   fileSize = files[0].size;
      // } else {
      fileSize = files.size;
      // }
      fileSize /= (1024 * 1024); // chuyen ve MB
      return fileSize.toFixed(2);
    } catch (ex) {
      console.error(ex.message);
    }
  }
  /**
   * createForm controls
   */
  public static createForm(formData: any, options: any, validate?: any): FormGroup {
    const formGroup = new FormGroup({});
    for (const property in options) {
      if (formData.hasOwnProperty(property)) {
        options[property][0] = formData[property];
      }
      formGroup.addControl(property, new FormControl(options[property][0], options[property][1]));
    }
    if (validate) {
      formGroup.setValidators(validate);
    }
    return formGroup;
  }

  public static convertEnumToChoiceArray(data: any) {
    const result = [];
    for (const prop in data) {
      result.push({
        code: data[prop],
        name: data[prop]
      });
    }
    return result;
  }
  /**
   * pureDataToTreeNode: for workFlows - Menu
   * @param dataSource: array Menu in VPS
   * @param pureData: array Workflows in VHCM_System
   */
  public static pureDataToTreeNode(dataSource: any, pureData: any): any {
    const dataDest = [];
    for (const item of pureData) {
      const tmp = dataSource.find(x => x.nodeId === item.nodeId);
      if (tmp) {
        tmp.isMainAction = item.isMainAction ? item.isMainAction : null;
        tmp.workFlowId = item.workFlowId ? item.workFlowId : null;
        tmp.wfMenuMappingId = item.wfMenuMappingId ? item.wfMenuMappingId : null;
        tmp.referenceNum = dataSource.filter(x => x.parentId === tmp.nodeId).length;
        dataDest.push(tmp);
      }
    }
    return CommonUtils.sort(dataDest, 'sortOrder');
  }
  /**
   * sort
   * @param dataSource: array
   * @param fieldSort: field choosed to sort
   * @param ascending: ascending: 1; descending: -1; default: 1.
   */
  public static sort(dataSource: any, fieldSort: any, ascending?: number) {
    if (!ascending) {
      ascending = 1;
    }
    return dataSource.sort((left, right): number => {
      if (left[fieldSort] < right[fieldSort]) {
        return -ascending;
      }
      if (left.sortOrder > right.sortOrder) {
        return ascending;
      }
      return 0;
    });
  }
  public static convertVpsMenus(data: any, keyId?: string): any {
    keyId = keyId || 'nodeId';
    const dataMap = data.reduce((m, d) => {
      m[d[keyId]] = Object.assign({}, d);
      return m;
    }, {});

    const listTemp = data.filter(d => {
      if (d.parentId !== null) { // assign child to its parent
        const parentNode = dataMap[d.parentId];
        if (parentNode['items'] === undefined || parentNode['items'] === null) {
          parentNode['items'] = [];
        }
        parentNode.items.push(dataMap[d[keyId]]);
        return false;
      }
      return true; // root node, do nothing
    }).map(d => dataMap[d[keyId]]);
    return listTemp;
  }
  // Check giao qu?? tr??nh gi???a 2 kho???ng ng??y
  public static tctCompareDates(date1, date2): number {
    const diff = date1 - date2;
    return (diff < 0) ? -1 : (diff === 0) ? 0 : 1;
  }
  public static betweenDate(check, startDate, endDate): boolean {
    return (CommonUtils.tctCompareDates(startDate, check) < 0) && (CommonUtils.tctCompareDates(check, endDate) < 0);
  }
  /**
   * check date conflict time
   * @param Date startDate1
   * @param Date endDate1
   * @param Date startDate2
   * @param Date endDate2
   * @return true or false
   */
  public static isConflictDate(startDate1, endDate1, startDate2, endDate2) {
    if (CommonUtils.isNullOrEmpty(endDate2)) {
      return (CommonUtils.isNullOrEmpty(endDate1) || (CommonUtils.tctCompareDates(startDate2, endDate1) < 0));
    } else {
      return (CommonUtils.isNullOrEmpty(endDate1) && (CommonUtils.tctCompareDates(startDate1, endDate2) < 0))
        || (!CommonUtils.isNullOrEmpty(endDate1)
          && (CommonUtils.betweenDate(startDate1, startDate2, endDate2)
            || CommonUtils.betweenDate(endDate1, startDate2, endDate2)
            || CommonUtils.betweenDate(startDate2, startDate1, endDate1)
            || CommonUtils.betweenDate(endDate2, startDate1, endDate1))
        );
    }
  }

}

