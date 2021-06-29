import { Component, OnInit } from '@angular/core';
import {ChapterFullView} from "../../data/chapterFullView";
import {UserService} from "../user.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {ChapterService} from "../chapter.service";

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {
  loggedin:boolean; //allow comment
  isauthor:boolean=false; //allow edit
  chapter?:ChapterFullView;
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
    if (!this.route.snapshot.paramMap.get('book')){this.location.back();return;} //don't even try if no book

  }
}
