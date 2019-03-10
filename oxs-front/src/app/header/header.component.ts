import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy{

  public isUserAuth =false;
  private authListenerSub:Subscription;

  constructor(private authService: AuthService) {

  }

  ngOnInit() {
  this.authListenerSub=this.authService.getAuthStatusListener().subscribe(isAuth =>{
    this.isUserAuth=isAuth;
  });
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe()
  }

  onLogout() {
    this.authService.logout();
    this.isUserAuth=false;
  }
}
