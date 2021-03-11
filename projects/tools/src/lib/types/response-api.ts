import { Pager } from './pager';

export class ResponseApi {
  success?: boolean;
  code?: number;
  message?: string;
  data?: ResponsePaging | any;
}
export class ResponsePaging {
  pager?: Pager;
  items?: any;
}
