import { Injectable } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject} from "rxjs";
import {BASE_DJANGO_URL} from "../data/constants";
import {User} from "../data/user";
import {ProfileView} from "../data/profileView";
import {EMPTY} from "rxjs";

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
    this.http.post<{key:string}>(url,{"username":username,"password":password}, this.httpOptions).subscribe(value =>this.loadUserInfo(value))

  }

  loadUserInfo(value: {key:string}) {
    let token:string = value["key"];
  if (!token){this.authenticatedChange.next(false); return;}
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
    }else{
      this.authenticatedChange.next(false);
    }
  }

  logout(){
    this.authenticated=false;
    this.user_id=null;
    this.user_name=null;
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('uname');
    this.authenticatedChange.next(false);
    this.http.post(BASE_DJANGO_URL+"auth/logout/",this.httpOptions); //probably not necessary but I'm not risking it
    this.httpOptions = {headers :new HttpHeaders({"Content-Type":"application/json"})};
  }
  profile():Observable<ProfileView>{
    if (!this.authenticated){return EMPTY;}
    let url = BASE_DJANGO_URL+"profile/"
    return this.http.get<ProfileView>(url,this.httpOptions);
  }

  register(username: string, password1: string, password2: string, email: string): Observable<boolean> {
    if (password1 != password2) {
      return new Observable<boolean>(subscriber => {subscriber.next(false)});
    }
    let url = BASE_DJANGO_URL + "exists/"
    let exists = this.http.post<boolean>(url, {name: username, email: email}, this.httpOptions).toPromise();
    if (exists){return new Observable<boolean>(subscriber => {subscriber.next(false)});}
    url = BASE_DJANGO_URL + "auth/registration/"
    this.http.post(url,{username:username,email:email,password1:password1,password2:password2},this.httpOptions);
    return new Observable<boolean>(subscriber => {subscriber.next(true)});


  }
}
