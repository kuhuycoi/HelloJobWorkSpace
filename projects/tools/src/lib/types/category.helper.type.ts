import { ICommonCategory, IRules } from "./categories.types";
import * as _ from 'lodash';
import { IGroupMember } from "./keyvalue.type";

export class CategoryHelper {
    public rules: IRules;
    public items: IGroupMember[];

    public _defaultGroup: string = null;    

    constructor(lst: ICommonCategory){        
        var self = this;
        if (lst.hasOwnProperty('rules')){
            this.rules = lst.rules;
            if(this.rules.groups){
                this.rules.groups = _.orderBy(this.rules.groups, ['order'], ['asc']);
            }
            _.forEach(this.rules.groups, function(value, key){
                if (value.default) self._defaultGroup = key;
            });
            this._defaultGroup = (this._defaultGroup)? this._defaultGroup : this.rules.groups[0].key as string;
        }
        if (lst.items){
            this.items = _.groupBy(lst.items, 'group'); 
            _.forEach(this.items, function(value, key){
                self.items[key] = _.orderBy(value, ['order'], ['asc']);
            });
        }
    }    

    public get mainMembers(){
        return this.items[this._defaultGroup];
    }

    public getMembers(key: string){
        return this.items[key];
    }

    public getItems(withGroup: boolean = false){
        if (!withGroup){
            var main = this.mainMembers;
            var rest = this.rest;
            return _.concat(main, rest);
        }
        return this.items;
    }    

    public get rest(){
        var self = this;
        var ret = [];
        _.forEach(this.items, function(value, key){
            if (key !== self._defaultGroup) ret = _.concat(ret, value);
        });
        return ret;
    }

    public get hasMultiGroups(){
        return this.rules.has_multi_groups;
    }

    public get groups(){
        return _.keys(this.items);        
    }

    public setProperty(group: string, key: string, name: string, value: any){
        var obj = _.find(this.items[group], function(item) {return item.key === key });
        if (!obj ) return null;
        obj[name] = value;
    }
    
    public setProperyForGroupMembers(group: string, name: string, value: any){
        var list = this.items[group];
        if (!list) return null;
        list.forEach(element => {
            element[name] = value; 
        });        
    }

    public getProperty(group: string, key: string,  name: string){
        var obj = _.find(this.items[group], function(item) {return item.key === key });
        if (!obj) return null;
        return obj[name];
    }
    
    public filter(func: (element) => boolean){
        return _.filter(this.getItems(false), func);
    }
}