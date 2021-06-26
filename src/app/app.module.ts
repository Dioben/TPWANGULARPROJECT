import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserauthComponent } from './userauth/userauth.component';
import { BookComponent } from './book/book.component';
import { BookEditorComponent } from './book-editor/book-editor.component';
import { ChapterComponent } from './chapter/chapter.component';
import { ChapterEditorComponent } from './chapter-editor/chapter-editor.component';
import { OverviewComponent } from './overview/overview.component';
import { ListingComponent } from './listing/listing.component';
import { ProfileComponent } from './profile/profile.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { NotfoundComponent } from './notfound/notfound.component';

@NgModule({
  declarations: [
    AppComponent,
    UserauthComponent,
    BookComponent,
    BookEditorComponent,
    ChapterComponent,
    ChapterEditorComponent,
    OverviewComponent,
    ListingComponent,
    ProfileComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
