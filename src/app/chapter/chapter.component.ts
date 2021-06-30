import { Component, OnInit } from '@angular/core';
import {ChapterFullView} from "../../data/chapterFullView";
import {UserService} from "../user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ChapterService} from "../chapter.service";
import {Comment} from "../../data/comment";
import {CommentPOST} from "../../data/commentPOST";

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {
  loggedin:boolean; //allow comment
  isauthor:boolean=false; //allow edit
  isadmin:boolean=false; //allow delete
  chapter?:ChapterFullView;
  chapterNum?:number;
  bookId?:number;
  page:number=1;
  maxpages:number=1;
  outercomments?: Comment[];
  innercomments?:Comment[];
  userId: number|null;
  isEditingChapter:boolean = false;

  constructor(private auth:UserService,private route:ActivatedRoute,private location:Location,private chapterService:ChapterService, private router:Router) {
    this.loggedin=auth.authenticated;
    this.isadmin=auth.userIsStaff;
    if (auth.authenticated){this.userId=auth.user_id;}else{this.userId=null;}
    auth.authenticatedChange.subscribe(value => this.handleLoginChange(value));
  }

  ngOnInit(): void {
    this.loadChapter();
  }

  private handleLoginChange(value: boolean) {
    this.loggedin=value;
    if (this.loggedin){
      this.userId=this.auth.user_id;
      this.isadmin=this.auth.userIsStaff
    }else {
      this.userId=null;
      this.isadmin=false;
      this.isauthor=false;
    }
  }

  private loadChapter() {
    if (!this.route.snapshot.paramMap.get('book')){this.location.back();return;} //don't even try if no book, if book ids werent unable to be 0 this would suck
    this.bookId = +this.route.snapshot.paramMap.get('book')!;

    if (this.route.snapshot.paramMap.get('number')){
      this.chapterNum = +this.route.snapshot.paramMap.get('number')!;
    }
    else{this.chapterNum=1;}
    if (this.route.snapshot.paramMap.get('page')){
      this.page = +this.route.snapshot.paramMap.get('page')!;
    }
    else{this.page=1;}
    this.getChapter();
    this.route.params.subscribe(params=>{//handle page change
      let changed = false;
      if(params['page'] && this.page!=params['page']){
        this.page=params['page'];
        this.loadComments();
      }
      if(params['number'] && this.chapterNum!=params['number']){
        this.chapterNum=params['number'];
        this.getChapter();
      }
    })
  }

  deleteChapter() {
    this.chapterService.deleteChapter(this.chapter!.chapter.id).subscribe(value => this.router.navigateByUrl("/book/"+this.bookId))
  }

  deleteComment(comment: Comment) {
    this.chapterService.commentDelete(comment.id).subscribe(value => {
      if (comment.parent) {
        let i = this.innercomments!.findIndex((item) => {
          return item.id == comment.id;
        });
        this.innercomments!.splice(i, 1);
      } else {
        let i = this.outercomments!.findIndex((item) => {
          return item.id == comment.id;
        })
        this.outercomments!.splice(i, 1);
      }
    });
  }

  postComment(text:string, id:number|null=null) {
    let commentPost = new CommentPOST();
    commentPost.chapter = this.chapter!.chapter.id;
    commentPost.parent = id;
    commentPost.content = text;
    this.chapterService.commentPost(commentPost).subscribe(value => {
      if (value.parent == null) {
        this.outercomments!.unshift(value);
      } else {
        this.innercomments!.unshift(value);
      }
    });
  }

  private loadComments() {
    this.chapterService.getComments(this.chapter!.chapter.id,this.page).subscribe(value => {
      this.outercomments = value.filter(value1 => value1.parent==null);
      this.innercomments = value.filter(value1 => value1.parent!=null);
    });
  }

  private getChapter() {
    this.chapterService.getChapter(this.bookId!,this.chapterNum!).subscribe(value => {
      this.chapter=value; this.maxpages=value.pages!;
      this.isauthor = this.auth.user_id==value.author!.id;
      if (this.page==1){
        this.outercomments = value.comments!.filter(value1 => value1.parent==null);
        this.innercomments = value.comments!.filter(value1 => value1.parent!=null);
      }
      else{
        this.loadComments();
      }
    });
  }

  public startEditChapter() {
    this.isEditingChapter = true;
  }

  public stopEditChapter() {
    this.isEditingChapter = false;
  }
}
