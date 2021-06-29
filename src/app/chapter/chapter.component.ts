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
  chapterId?:number;
  comments?:Comment[];
  page:number=1;
  constructor(private auth:UserService,private route:ActivatedRoute,private location:Location,private chapterService:ChapterService) {
    this.loggedin=auth.authenticated;
    auth.authenticatedChange.subscribe(value => this.handleLoginChange(value));
  }

  ngOnInit(): void {
  }

  private handleLoginChange(value: boolean) {
    this.loggedin=value;
    if (this.loggedin){
      this.isauthor = this.auth.user_id==this.bookId
    }
  }
}
