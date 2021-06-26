import { Component, OnInit } from '@angular/core';
import {Chapter} from "../../data/chapter";
import {Book} from "../../data/book";

import {ListingService} from "../listing.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  newchaps? : Chapter[];
  rising?: Book[];
  toprated?: Book[];
  constructor(private listingService:ListingService) { }

  ngOnInit(): void {
    this.listingService.hot().subscribe(value => this.rising=value.books?.slice(0,5))
    this.listingService.new().subscribe(value => this.newchaps=value.chapters?.slice(0,5))
    this.listingService.top().subscribe(value => this.toprated= value.books?.slice(0,5))
  }

}
