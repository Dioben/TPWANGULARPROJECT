import { Component, OnInit } from '@angular/core';
import {ChapterFullView} from "../../data/chapterFullView";
import {UserService} from "../user.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {ChapterService} from "../chapter.service";
import {Comment} from "../../data/comment";

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {
  loggedin:boolean; //allow comment
  isauthor:boolean=false; //allow edit
  chapter?:ChapterFullView;
  chapterNum?:number;
  authorId?:number;
  comments?:Comment[];
  bookId?:number;
  page:number=1;
  constructor(private auth:UserService,private route:ActivatedRoute,private location:Location,private chapterService:ChapterService) {
    this.loggedin=auth.authenticated;
    auth.authenticatedChange.subscribe(value => this.handleLoginChange(value));
  }

  ngOnInit(): void {
    this.loadChapter();
  }

  private handleLoginChange(value: boolean) {
    this.loggedin=value;
    if (this.loggedin){
      this.isauthor = this.auth.user_id==this.authorId;
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
    this.chapterService.getChapter(this.bookId,this.chapterNum).subscribe(value => {
      this.chapter=value;
      if (this.page==1){this.comments = value.comments!}
    else{this.chapterService.getComments(value.chapter.id,this.page).subscribe(value => this.comments=value);}
    })
  }
}
