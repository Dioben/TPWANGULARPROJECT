import { Component, OnInit } from '@angular/core';
import {UserService} from "../user.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {BookFullView} from "../../data/bookFullView";
import {BookService} from "../book.service";
import {Review} from "../../data/review";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  loggedin:boolean; //allow review
  isauthor:boolean=false; //allow edit
  book?:BookFullView;
  bookId?:number;
  reviews?:Review[];
  page:number=1;
  constructor(private auth:UserService,private route:ActivatedRoute,private location:Location,private bookService:BookService) {
    this.loggedin=auth.authenticated;
    auth.authenticatedChange.subscribe(value => this.handleLoginChange(value));
  }

  ngOnInit(): void {
    this.loadBook();
  }

  private handleLoginChange(value: boolean) {
    this.loggedin=value;
    if (this.loggedin){
      this.isauthor = (this.auth.user_id==this.bookId)
    }
  }

  private loadBook() {
    if (!this.route.snapshot.paramMap.get('pk')){this.location.back();return;} //don't even try if no id
    this.bookId = +this.route.snapshot.paramMap.get('pk')!;
    if (this.route.snapshot.paramMap.get('page')){
      this.page= +this.route.snapshot.paramMap.get('page')!; //defaulted to 1
    }
    this.bookService.getBook(this.bookId!).subscribe(value => {this.book=value; if (this.page==1){this.reviews = value.reviews}});
   if (this.page!=1){
     this.bookService.getReviews(this.bookId,this.page).subscribe(value => this.reviews=value);
   }
  }
}
