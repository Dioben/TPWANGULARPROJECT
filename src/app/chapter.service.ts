import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {Observable} from "rxjs/internal/Observable";
import {BASE_DJANGO_URL} from "../data/constants";
import {ChapterFullView} from "../data/chapterFullView";
import {Comment} from "../data/comment";
import {Chapter} from "../data/chapter";
import {ChapterPOST} from "../data/chapterPOST";
import {CommentPOST} from "../data/commentPOST";

@Injectable({
  providedIn: 'root'
})
export class ChapterService {

  constructor(private http:HttpClient,private auth:UserService) { }

  getChapter(book:number,chapter:number): Observable<ChapterFullView>{
    let url:string = BASE_DJANGO_URL+"chapter/"+book+"/"+chapter+"/";
    return this.http.get<ChapterFullView>(url,this.auth.httpOptions);

  }

  getComments(chapterId:number,page:number):Observable<Comment[]>{
    let url:string = BASE_DJANGO_URL+"comments/"+chapterId+"/"+page+"/";
    return this.http.get<Comment[]>(url,this.auth.httpOptions);
  }

  postChapter(chapter:ChapterPOST):Observable<any>{
    //data structures does not allow me to test if author, oh well django does it anyway
    if(!this.auth.authenticated){throw new Error("Anon cannot post chapters");}
    let url:string = BASE_DJANGO_URL+"chapterPost/";
    return this.http.post(url,chapter,this.auth.httpOptions);
  }
  editChapter(chapter:Chapter):Observable<any>{
    if(!this.auth.authenticated){throw new Error("Anon cannot edit chapters");}
    let url:string = BASE_DJANGO_URL+"chapterEdit/";
    return this.http.put(url,chapter,this.auth.httpOptions);
  }
  deleteChapter(chapterId:number):Observable<any>{
    if(!this.auth.authenticated){throw new Error("Anon cannot delete chapters");}
    let url:string = BASE_DJANGO_URL+"chapterDelete/"+chapterId+"/";
    return this.http.delete(url,this.auth.httpOptions);
  }
  commentPost(comment:CommentPOST): Observable<Comment>{
    if(!this.auth.authenticated){throw new Error("Anon cannot comment");}
    let url:string = BASE_DJANGO_URL+"comment/";
    return this.http.post<Comment>(url,comment,this.auth.httpOptions);
  }
  commentDelete(commentId:number): Observable<any>{
    if(!this.auth.authenticated){throw new Error("Anon cannot delete comments");}
    let url:string = BASE_DJANGO_URL+"commentDelete/"+commentId+"/";
    return this.http.delete(url,this.auth.httpOptions);
  }
}
