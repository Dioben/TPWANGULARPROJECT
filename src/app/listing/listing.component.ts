import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute, UrlSegment} from "@angular/router";
import {ListingService} from "../listing.service";



@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})

export class ListingComponent implements OnInit {
  page:number=1;
  totalpages?:number;
  type?:string;
  headerMessage?:string;
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

  }
}
