export class WebsiteModule {
    id: Number;
    name: String;
    controller: String;
    icon: String;
    parentId: WebsiteModule;
    isShow: Boolean;
    isDeleted: Boolean;
    orderNumber: Number;
    level: Number;
    routeLink: String;
    children?: WebsiteModule[];
    lang?: String
    nameAscii?: String;
}