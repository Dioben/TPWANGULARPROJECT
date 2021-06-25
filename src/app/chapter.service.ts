import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {Observable} from "rxjs/internal/Observable";
import {BookFullView} from "../data/bookFullView";
import {Review} from "../data/review";
import {BASE_DJANGO_URL} from "../data/constants";
import {Book} from "../data/book";

@Injectable({
  providedIn: 'root'
})
export class ChapterService {

  constructor(private http:HttpClient,private auth:UserService) { }

}
