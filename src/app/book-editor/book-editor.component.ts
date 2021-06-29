import {Component, Input, OnInit, Output,EventEmitter} from '@angular/core';
import {Book} from "../../data/book";
import {BookService} from "../book.service";
import {animate, style, transition, trigger} from "@angular/animations";


@Component({
  selector: 'app-book-editor',
  templateUrl: './book-editor.component.html',
  styleUrls: ['./book-editor.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ],
})
export class BookEditorComponent implements OnInit {

  @Input("book") book!:Book;
  message:string="";
  @Output() bookEditEvent = new EventEmitter<Book>();
  constructor(private service:BookService) { }

  ngOnInit(): void {
  }

  submit(){
    this.service.editBook(this.book).subscribe(value => {this.bookEditEvent.emit(this.book)},error => {this.message="Failed to submit update"});
  }
}
