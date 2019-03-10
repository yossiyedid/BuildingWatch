import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string;
  private expiresIn: Date;

  private isAuth = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  createUser(username: string, password: string) {
    const user = { username: username, password: password };
    this.http
      .post("http://localhost:3000/api/users/signup", user)
      .subscribe(response => {
        this.login(username,password);//auto login
      });

  }

  login(username: string, password: string) {
    const user = { username: username, password: password };
    this.http
      .post<{ token: string; expiresIn: number }>(
        "http://localhost:3000/api/users/login",
        user
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.isAuth = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(["/"]);
        }
      });
  }
  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    //able to listen from other parts to changes in auth
    return this.authStatusListener.asObservable();
  }
  logout() {
    this.token = null;
    this.clearAuthData();
    this.authStatusListener.next(false);
  }
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  getIsAuth() {
    return this.isAuth;
  }
}
