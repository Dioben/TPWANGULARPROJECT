import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {ChapterPOST} from "../../data/chapterPOST";
import {ChapterService} from "../chapter.service";

@Component({
  selector: 'app-chapter-editor',
  templateUrl: './chapter-editor.component.html',
  styleUrls: ['./chapter-editor.component.css']
})
export class ChapterEditorComponent implements OnInit {
  @Output() stopCreateChapterEvent = new EventEmitter();
  @Input() bookId?:number;

  constructor(private chapterService:ChapterService) { }

  ngOnInit(): void {
  }

  stopCreateChapter() {
    this.stopCreateChapterEvent.emit();
  }

  public createChapter(data:{"title":string, "text":string}) {
    let newChapter = new ChapterPOST();
    newChapter.title = data.title;
    newChapter.text = data.text;
    newChapter.novel = this.bookId!;
    this.chapterService.postChapter(newChapter).subscribe(value => {
      this.stopCreateChapter()
    })
  }
}
