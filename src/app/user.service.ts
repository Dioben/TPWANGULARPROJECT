import { Injectable } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject} from "rxjs";
import {BASE_DJANGO_URL} from "../data/constants";
import {User} from "../data/user";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  authenticated:boolean;
  authenticatedChange: Subject<boolean> = new Subject<boolean>();
  user_id:number|null;
  user_name:string|null;
  httpOptions: { headers: HttpHeaders };

  constructor(private http:HttpClient) {
    this.authenticated=false;
    this.httpOptions = {headers : new HttpHeaders({"Content-Type":"application/json"})};
    this.authenticatedChange.subscribe((value) => {this.authenticated = value}); //should notify when auth changes

    let token = localStorage.getItem('token')? localStorage.getItem('token') : null;
    if (token){
      this.authenticated=true;
      this.httpOptions = {headers : new HttpHeaders({"Content-Type":"application/json","Authorization": "Token "+token})};
    }
    else{
      this.httpOptions ={headers : new HttpHeaders({"Content-Type":"application/json"})};
    }
    this.user_id = localStorage.getItem('uid')? parseInt(<string>localStorage.getItem('uid')) : null;
    this.user_name = localStorage.getItem('uname')? localStorage.getItem('uname') : null;

    if (!this.user_id){this.authenticated=false;}

  }

  login(username:string, password:string):void{
    let url:string = BASE_DJANGO_URL+"/auth/login/";
    this.http.post<{key:string}>(url,{"username":username,"password":password}, this.httpOptions).subscribe(value => this.loadUserInfo(value))
  }

  loadUserInfo(value: {key:string}) {
    let token:string = value["key"];
  if (!token){return;}
    this.httpOptions = {headers : new HttpHeaders({"Content-Type":"application/json","Authorization": "Token "+token})};
    let url:string = BASE_DJANGO_URL+"/auth/user/";
    this.http.get<User>(url,this.httpOptions).subscribe(value1 => this.finalizeLogin(value1));
  }

  finalizeLogin(user:User){
    if (user){
      this.user_id=user.pk;
      this.user_name=user.username!;
      this.authenticated=true;
      this.authenticatedChange.next(true);
    }
  }

  logout(){
    this.authenticated=false;
    this.httpOptions = {headers :new HttpHeaders({"Content-Type":"application/json"})};
    this.user_id=null;
    this.user_name=null;
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('uname');
    this.authenticatedChange.next(false);
  }
  profile(){
    if (!this.authenticated){return;}

  }
}
