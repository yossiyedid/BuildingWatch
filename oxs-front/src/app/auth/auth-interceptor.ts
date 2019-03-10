import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

//dynamic change to header request/response
@Injectable()
export class AuthInterceptor implements HttpInterceptor{

  constructor(private authService:AuthService) {}

//fetch the token to header
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {//next is same as middleware JS
    const authToken =this.authService.getToken();//get token from service
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)//set func does not override the headers. its adding
    });
    return next.handle(authRequest);
  }

}
