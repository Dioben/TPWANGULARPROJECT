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
  userIsStaff: boolean;

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
    this.userIsStaff = localStorage.getItem('isStaff')? localStorage.getItem('isStaff')=="true" : false;
    if (!this.user_id){this.authenticated=false;}

  }

  async login(username:string, password:string):Promise<boolean>{
    let url:string = BASE_DJANGO_URL+"auth/login/";
    await this.http.post<{key:string}>(url,{"username":username,"password":password}, this.httpOptions).toPromise().then(value => {
      this.loadUserInfo(value);
      return true;
    }).catch(e => {})
    return false;
  }

  private loadUserInfo(value: {key:string}) {
    let token:string = value["key"];
  if (!token){this.authenticatedChange.next(false); return;}
    this.httpOptions = {headers : new HttpHeaders({"Content-Type":"application/json","Authorization": "Token "+token})};
    let url:string = BASE_DJANGO_URL+"whoami/";
    this.http.get<User>(url,this.httpOptions).subscribe(value1 => this.finalizeLogin(value1,token));
  }

  private finalizeLogin(user:User,token:string){
    if (user){
      this.user_id=user.pk;
      this.user_name=user.username!;
      this.userIsStaff = user.is_staff;
      this.authenticated=true;
      localStorage.setItem("token",token);
      localStorage.setItem("uid",String(user.pk));
      localStorage.setItem("uname",<string>user.username);
      localStorage.setItem("isStaff",user.is_staff?"true":"false");
      this.authenticatedChange.next(true);
    }else{
      this.authenticatedChange.next(false);
    }
  }

  logout(){
    this.authenticated=false;
    this.user_id=null;
    this.user_name=null;
    this.userIsStaff=false;
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('uname');
    localStorage.removeItem("isStaff");
    this.authenticatedChange.next(false);
    this.http.post(BASE_DJANGO_URL+"auth/logout/",this.httpOptions); //probably not necessary but I'm not risking it
    this.httpOptions = {headers :new HttpHeaders({"Content-Type":"application/json"})};
  }
  profile():Observable<ProfileView>{
    if (!this.authenticated){return EMPTY;}
    let url = BASE_DJANGO_URL+"profile/"
    return this.http.get<ProfileView>(url,this.httpOptions);
  }

  async register(username: string, password1: string, password2: string, email: string): Promise<boolean> {
    if (password1 != password2) {
      return false;
    }
    let url = BASE_DJANGO_URL + "exists/";
    let exists: boolean = await this.http.post<boolean>(url, {
      name: username,
      email: email
    }, this.httpOptions).toPromise();
    if (exists) {
      return false;
    }
    url = BASE_DJANGO_URL + "auth/registration/";
    await this.http.post(url, {
      username: username,
      email: email,
      password1: password1,
      password2: password2
    }, this.httpOptions).toPromise();
    return true;


  }
}
