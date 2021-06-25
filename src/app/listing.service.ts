import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {BookListingView} from "../data/bookListingView";
import {BASE_DJANGO_URL} from "../data/constants";
import {ChapterListingView} from "../data/chapterListingView";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  constructor(private http:HttpClient,private auth:UserService) {}
  hot(page:number):Observable<BookListingView>{
    let url:string= BASE_DJANGO_URL+"hot/"+page+"/";
    return this.http.get<BookListingView>(url,this.auth.httpOptions);
  }
  top(page:number):Observable<BookListingView>{
    let url:string= BASE_DJANGO_URL+"top/"+page+"/";
    return this.http.get<BookListingView>(url,this.auth.httpOptions);
  }
  new(page:number):Observable<ChapterListingView>{
    let url:string= BASE_DJANGO_URL+"new/"+page+"/";
    return this.http.get<ChapterListingView>(url,this.auth.httpOptions);
  }
  search(query:string,page:number):Observable<BookListingView>{
    let url:string= BASE_DJANGO_URL+"search/"+query+"/"+page+"/";
    return this.http.get<BookListingView>(url,this.auth.httpOptions);
  }
}
