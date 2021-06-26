import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListingComponent} from "./listing/listing.component";
import {ProfileComponent} from "./profile/profile.component";
import {BookComponent} from "./book/book.component";
import {ChapterComponent} from "./chapter/chapter.component";
import {ChapterEditorComponent} from "./chapter-editor/chapter-editor.component";
import {BookEditorComponent} from "./book-editor/book-editor.component";
import {OverviewComponent} from "./overview/overview.component";
import {NotfoundComponent} from "./notfound/notfound.component";

const routes: Routes = [
  {path: 'hot', component: ListingComponent},
  {path: 'new', component: ListingComponent},
  {path: 'top', component: ListingComponent},
  {path: 'hot/:page', component: ListingComponent},
  {path: 'new/:page', component: ListingComponent},
  {path: 'top/:page', component: ListingComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'book/:pk', component: BookComponent},
  {path: 'book/:pk/:page', component: BookComponent},
  {path: 'chapter/:book/:number', component: ChapterComponent},
  {path: 'chapter/:book/:number/:page', component: ChapterComponent},
  {path: 'search/:page', component: ListingComponent},
  {path: 'search', component: ListingComponent},
  {path: '', component: OverviewComponent},
  {path: '**', component: NotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
