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
  book!:BookFullView;
  bookId?:number;
  reviews?:Review[];
  page:number=1;
  editing:boolean=false;

  constructor(public auth:UserService, private route:ActivatedRoute, private location:Location, private bookService:BookService) {
    this.loggedin = auth.authenticated;
    auth.authenticatedChange.subscribe(value => this.handleLoginChange(value));
    this.loadBook();
    let editing = localStorage.getItem("isEditingBook")
    if (editing != null) {
      let editingVal = parseInt(editing, 10)
      if (!isNaN(editingVal) && editingVal == this.bookId)
        this.editing = true
    }
  }

  ngOnInit(): void {
    if (this.loggedin && this.book != undefined) {
      this.isauthor = this.auth.user_id == this.book.book.author
    }
  }

  private handleLoginChange(value: boolean) {
    this.loggedin=value;
  }

  private loadBook() {
    if (!this.route.snapshot.paramMap.get('pk')){this.location.back();return;} //don't even try if no id
    this.bookId = +this.route.snapshot.paramMap.get('pk')!;
    if (this.route.snapshot.paramMap.get('page')){
      this.page= +this.route.snapshot.paramMap.get('page')!; //defaulted to 1
    }
    this.bookService.getBook(this.bookId!).subscribe(value => {
      this.book=value;
      if (this.page==1) {
        this.reviews = value.reviews
      }
      if (this.loggedin) {
        this.isauthor = this.auth.user_id == this.book.book.author
      }
    });
   if (this.page!=1){
     this.bookService.getReviews(this.bookId,this.page).subscribe(value => this.reviews=value);
   }
  }
  
  public bookmark() {
    this.bookService.bookmark(this.bookId!).subscribe(value => this.book.bookmarked = value.bookmarked);
  }

  public startEditBook() {
    this.editing = true;
    localStorage.setItem("isEditingBook", this.bookId!.toString())
  }

  public stopEditBook() {
    this.editing = false;
    localStorage.removeItem("isEditingBook")
  }

  public editBook(data:{"title":string, "description":string}) {
    this.book.book.title = data.title;
    this.book.book.description = data.description;
    this.bookService.editBook(this.book.book).subscribe(value => {
      localStorage.removeItem("isEditingBook");
      window.location.reload();
    });
  }

  public deleteBook() {
    this.bookService.deleteBook(this.book.book).subscribe(value => this.location.back());
  }
}
