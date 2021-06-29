import { Component, OnInit } from '@angular/core';
import {Book} from "../../data/book";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../user.service";
import {Location} from "@angular/common";
import {ProfileView} from "../../data/profileView";
import {BookService} from "../book.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  bookmarks?: Book[];
  published?: Book[];
  creatorvisible:boolean=false;
  constructor(private route:ActivatedRoute,private auth:UserService,private location:Location, private bookService:BookService) { }

  ngOnInit(): void {
    if (!this.auth.authenticated){this.location.back();}
    this.auth.profile().subscribe(value => this.loadProfile(value))
    this.auth.authenticatedChange.subscribe(value => this.onAuthChange(value));

  }
  private loadProfile(value: ProfileView) {
    this.bookmarks=value.bookmarks;
    this.published=value.books;

  }

  deleteBook(value: Book){
    this.bookService.deleteBook(value).subscribe(value => this.published=this.published?.filter(book=> book!==value));
  }

  private onAuthChange(value:boolean){
    if (!value){this.location.back();return;}
    else{
      this.auth.profile().subscribe(value => this.loadProfile(value)); //I don't think this will ever happen
    }
  }

  toggleCreator() {
    this.creatorvisible=!this.creatorvisible;
  }
}
