import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListingComponent} from "./listing/listing.component";
import {ProfileComponent} from "./profile/profile.component";
import {BookComponent} from "./book/book.component";
import {ChapterComponent} from "./chapter/chapter.component";
import {ChapterEditorComponent} from "./chapter-editor/chapter-editor.component";
import {BookEditorComponent} from "./book-editor/book-editor.component";
import {OverviewComponent} from "./overview/overview.component";

const routes: Routes = [
  {path: 'hot/:page', component: ListingComponent},
  {path: 'new/:page', component: ListingComponent},
  {path: 'top/:page', component: ListingComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'book/:pk/:page', component: BookComponent},
  {path: 'chapter/:book/:number/:page', component: ChapterComponent},
  {path: 'chaptereditor/:book/:chapter', component: ChapterEditorComponent},
  {path: 'bookeditor/:book', component: BookEditorComponent},
  {path: 'search', component: ListingComponent},
  {path: '', component: OverviewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
