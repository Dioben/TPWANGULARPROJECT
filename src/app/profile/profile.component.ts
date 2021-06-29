import { Component, OnInit } from '@angular/core';
import {Book} from "../../data/book";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../user.service";
import {Location} from "@angular/common";
import {ProfileView} from "../../data/profileView";
import {BookService} from "../book.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({height: 0, opacity: 0, overflow: "hidden"}),
        animate('200ms ease-out', style({height: 500, opacity: 1, overflow: "hidden"}))
      ]),
      transition(':leave', [
        style({height: 500, opacity: 1, overflow: "hidden"}),
        animate('200ms ease-out', style({height: 0, opacity: 0, overflow: "hidden"}))
      ])
    ])
  ],
})
export class ProfileComponent implements OnInit {
  bookmarks?: Book[];
  published?: Book[];
  editableMap: Map<Book,boolean> = new Map<Book,boolean>();
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

  deleteBook(book: Book){
    this.bookService.deleteBook(book).subscribe(value => this.published?.forEach((value1, index) => {if (value1==book){this.published?.splice(index,1)}} ));
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

  toggleEditor(book:Book){
    this.editableMap.set(book,!this.editableMap.get(book));
  }
}
