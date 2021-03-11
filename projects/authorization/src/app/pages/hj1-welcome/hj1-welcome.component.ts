import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
import { environment } from 'projects/authorization/src/environments/environment';

@Component({
  selector: 'app-hj1-welcome',
  templateUrl: './hj1-welcome.component.html',
  styleUrls: ['./hj1-welcome.component.scss']
})
export class Hj1WelcomeComponent implements OnInit {
  public identifier: string = 'welcome';
  private socket: any = undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Wf1NewUserService
  ) {
    let redirectUrl = this.route.snapshot.queryParams['r'];
    if (!redirectUrl || !redirectUrl.length) {
      redirectUrl = environment.mainDomain;
    }
    localStorage.setItem('redirectUrl', redirectUrl);
    this.service.moveTo(this.identifier, this.router);
  }

  ngOnInit(): void {
    this.service.reset();
  }

  public registerAccount() {
    this.service.nextStep(this.router);
  }

  public loginWithGoogle() {
    var data = {
      provider: 'google',
      socketId: this.socket.id
    }
    // this.snsService.link(data).subscribe((res)=>{
    //   if (res){
    //     ///Wait callback from socket
    //   }else{
    //     //TODO:
    //     console.error('Cannot get SNS information')
    //   }
    // });
  }

  public loginWithFacebook() {
    var data = {
      provider: 'facebook',
      socketId: this.socket.id
    }
    // this.snsService.link(data).subscribe((res)=>{
    //   if (res){
    //     ///Wait callback from socket
    //   }else{
    //     //TODO:
    //     console.error('Cannot get SNS information')
    //   }
    // });
  }
}
