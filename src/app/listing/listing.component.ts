import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute, UrlSegment} from "@angular/router";
import {ListingService} from "../listing.service";
import {Book} from "../../data/book";
import {Chapter} from "../../data/chapter";
import {query} from "@angular/animations";
import {ChapterListingView} from "../../data/chapterListingView";
import {BookListingView} from "../../data/bookListingView";



@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})

export class ListingComponent implements OnInit {
  page:number=1;
  totalpages:number=1;
  books?:Book[];
  chapters?:Chapter[];
  type?:string;
  headerMessage?:string;
  query?:string;
  isPopulated:boolean = true;

  constructor(private location:Location,private route:ActivatedRoute,private listingService:ListingService) { }

  ngOnInit(): void {
    this.setViewType();
    this.populatePage();
  }

  private setViewType() {
    let url:UrlSegment = this.route.snapshot.url.reverse().pop()!;//should only match 1 ever
    this.type=url.path;
  }

  private populatePage() {
    if (this.route.snapshot.paramMap.get('page')){
      this.page= +this.route.snapshot.paramMap.get('page')!; //defaulted to 1
    }
    if (this.type=="new"){
      this.headerMessage= "New Chapters";
      this.listingService.new(this.page).subscribe(value => this.handleResponseNew(value));
    }
    if (this.type=="hot"){
      this.headerMessage= "Popular Books";
      this.listingService.hot(this.page).subscribe(value => this.handleResponseBooks(value));
    }
    if (this.type=="top"){
      this.headerMessage= "Top rated Books";
      this.listingService.top(this.page).subscribe(value => this.handleResponseBooks(value));
    }
    if (this.type=="search"){
      this.query= this.route.snapshot.queryParams['title'];
      if (!this.query){this.query="";}
      this.headerMessage="Searching for \""+this.query+"\"";
      this.listingService.search(this.query!,this.page).subscribe(value => this.handleResponseBooks(value));
    }
  }

  handleResponseNew(value:ChapterListingView){
    if (value.chapters?.length==0 || this.page>value.pages!){
      this.isPopulated = false;
    }
    this.chapters=value.chapters;
    this.totalpages=value.pages!;
  }
  handleResponseBooks(value:BookListingView){
    if (value.books?.length==0 || this.page>value.pages!){
      this.isPopulated = false;
    }
    this.books=value.books;
    this.totalpages=value.pages!;
  }
}
