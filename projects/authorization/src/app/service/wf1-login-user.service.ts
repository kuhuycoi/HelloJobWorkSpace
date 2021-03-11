import { Injectable } from '@angular/core';
import { ProfileType } from 'projects/tools/src/lib/types/profile.type';

@Injectable({
  providedIn: 'root'
})
export class Wf1LoginUserService {
  public userInfo: ProfileType = new ProfileType();
}
