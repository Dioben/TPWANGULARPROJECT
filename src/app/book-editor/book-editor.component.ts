import {Component, Input, OnInit, Output,EventEmitter} from '@angular/core';
import {Book} from "../../data/book";
import {BookService} from "../book.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {BookPOST} from "../../data/bookPOST";


@Component({
  selector: 'app-book-editor',
  templateUrl: './book-editor.component.html',
  styleUrls: ['./book-editor.component.css']
})
export class BookEditorComponent implements OnInit {

  @Output() stopEditBookEvent = new EventEmitter();
  @Input() book:Book = new Book();
  @Input() embedded?:boolean = false;
  @Input() bookList?:Book[];
  message:string="";

  constructor(private bookService:BookService) { }

  ngOnInit(): void { }

  public stopEditBook() {
    this.stopEditBookEvent.emit();
  }

  private editBook(data:{"title":string, "description":string,"cover":string}) {
    this.book.title = data.title;
    this.book.description = data.description;
    if (data.cover!=""){this.book.cover=data.cover;}
    this.bookService.editBook(this.book).subscribe(value => {
      if (this.bookList) {
        let i = this.bookList.findIndex((book) => {
          return book.id == this.book.id;
        });
        this.bookList[i] = this.book;
      }
      this.stopEditBook();
    }, error => {
      this.message = "Failed to update book";
    });
  }

  private createBook(data:{title: string, description:string,"cover":string}) {
    let bookPost = new BookPOST();
    bookPost.title = data.title;
    bookPost.description = data.description;
    console.log(data['cover'])
    if (data.cover!=""){this.book.cover=data.cover;}
    this.bookService.postBook(bookPost).subscribe(value => {
      this.book = value;
      if (this.bookList) {
        this.bookList.push(this.book);
      }
      this.stopEditBook();
    }, error => {
      this.message = "Failed to create book"
    })
  }

  public submitBook(data:{title: string, description:string,cover:string}) {
    if (this.book.id) this.editBook(data);
    else this.createBook(data);
  }
}
