import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {Observable} from "rxjs/internal/Observable";
import {BookFullView} from "../data/bookFullView";
import {BASE_DJANGO_URL} from "../data/constants";
import {Review} from "../data/review";
import {Book} from "../data/book";
import {BookPOST} from "../data/bookPOST";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http:HttpClient,private auth:UserService) { }
  getBook(id:number):Observable<BookFullView>{
    let url:string= BASE_DJANGO_URL+"book/"+id+"/";
    return this.http.get<BookFullView>(url,this.auth.httpOptions);
  }
  getReviews(book:number,page:number):Observable<Review[]>{
    let url:string= BASE_DJANGO_URL+"reviews/"+book+"/"+page+"/";
    return this.http.get<Review[]>(url,this.auth.httpOptions);
  }
  bookmark(book:number):Observable<{bookmarked:boolean}>{
    if (!this.auth.authenticated){throw new Error("Bookmarking while not logged in");} //i expect UI design to make any of these exceptions impossible
    let url:string= BASE_DJANGO_URL+"bookmark/"+book+"/";
    return this.http.get<{bookmarked:boolean}>(url,this.auth.httpOptions);
  }
  postBook(book:BookPOST):Observable<Book>{
    if (!this.auth.authenticated){throw new Error("Creating books while not logged in");}
    let url:string =BASE_DJANGO_URL+"bookPost/";
    return this.http.post<Book>(url,book,this.auth.httpOptions);
  }
  editBook(book:Book):Observable<any>{
    if(book.author!=this.auth.user_id){throw new Error("You are not this book's author");}
    let url:string=BASE_DJANGO_URL+"editBook/";
    return this.http.put(url,book,this.auth.httpOptions);
  }
  deleteBook(book:Book){
    if(book.author!=this.auth.user_id){throw new Error("You are not this book's author");}
    let url:string=BASE_DJANGO_URL+"deleteBook/"+book.id+"/";
    return this.http.delete(url,this.auth.httpOptions);
  }
  postReview(review:Review,book:Book):Observable<Review>{
    if(!this.auth.authenticated || book.author==this.auth.user_id){throw new Error("You cannot review this book");}
    let url:string=BASE_DJANGO_URL+"review/";
    return this.http.post<Review>(url,review,this.auth.httpOptions);
  }
  deleteReview(review:number):Observable<any>{
  if(!this.auth.authenticated){throw new Error("Anon should not be able to delete reviews");}
  let url:string = BASE_DJANGO_URL+"reviewDelete/"+review+"/";
  return this.http.delete(url,this.auth.httpOptions);
  }
}
