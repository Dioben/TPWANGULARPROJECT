import { Component, OnInit } from '@angular/core';
import {UserService} from "../user.service";


enum states {CLOSED_LOGIN,CLOSED_REGISTER,LOGIN,REGISTER,LOGIN_WAITING,REGISTER_WAITING,AUTHENTICATED};
@Component({
  selector: 'app-userauth',
  templateUrl: './userauth.component.html',
  styleUrls: ['./userauth.component.css']
})

export class UserauthComponent implements OnInit {

  username: string|null="";
  password: string="";
  registerName:string="";
  registerPassword1:string="";
  registerPassword2:string="";
  registerEmail:string="";
  message:string="";
  state:states;
  constructor(private userService:UserService) {
    if (userService.authenticated){
      this.state=states.AUTHENTICATED;
      this.username=userService.user_name;
    }else{this.state=states.CLOSED_LOGIN}
    userService.authenticatedChange.subscribe(value => this.handleAuthChange(value));
  }

  ngOnInit(): void {
  }

  public async register() {
    if (this.registerPassword2 != this.registerPassword1) {
      this.message = "Passwords do not match";
      return;
    }
    this.state = states.REGISTER_WAITING;
    this.handleRegister(await this.userService.register(this.registerName, this.registerPassword1, this.registerPassword2, this.registerEmail));
  }
  private handleRegister(value:boolean){
    if (!value){
      this.state=states.REGISTER;
      this.message="username or email is taken";
    }else{
      this.username=this.registerName;
      this.password=this.registerPassword1;
      this.login();
    }
  }

  public login() {
    this.state=states.LOGIN_WAITING;
    this.userService.login(this.username!,this.password);
  }
  public logout(){
    this.userService.logout();
  }

  private handleAuthChange(value: boolean) {
    if (value){
      this.state=states.AUTHENTICATED;
    }
    else{
      switch (this.state){
        case states.AUTHENTICATED:{this.state=states.LOGIN;break;}
        case states.LOGIN_WAITING:{this.state=states.LOGIN;break;} //will probably never happen
        case states.REGISTER:{this.state=states.REGISTER_WAITING;break;} //will probably never happen
      }
        }
  }
  public toggleDropdown(){//dropdown disappears while authenticated or waiting
    switch (this.state){
      case states.CLOSED_LOGIN:{this.state=states.LOGIN;break;}
      case states.LOGIN:{this.state=states.CLOSED_LOGIN;break;}
      case states.CLOSED_REGISTER:{this.state=states.REGISTER;break;}
      case states.REGISTER:{this.state=states.CLOSED_REGISTER;break;}
    }
  }
  public goToRegister(){
    this.state = states.REGISTER;
  }
  public goToLogin(){
    this.state = states.LOGIN;
  }
}
