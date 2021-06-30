import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {ChapterPOST} from "../../data/chapterPOST";
import {ChapterService} from "../chapter.service";
import {Chapter, ChapterSimple} from "../../data/chapter";

@Component({
  selector: 'app-chapter-editor',
  templateUrl: './chapter-editor.component.html',
  styleUrls: ['./chapter-editor.component.css']
})
export class ChapterEditorComponent implements OnInit {
  @Output() stopCreateChapterEvent = new EventEmitter();
  @Input() bookId!:number;
  @Input() chapter:Chapter = new Chapter();
  @Input() chapterSimple?:ChapterSimple;
  @Input() chapterList?:ChapterSimple[];

  constructor(private chapterService:ChapterService) { }

  ngOnInit(): void {
    if (this.chapterSimple)
      this.chapterService.getChapter(this.bookId, this.chapterSimple.number!).subscribe(value => {
        this.chapter = value.chapter;
      });
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
      if (this.chapterList) {
        let simple = new ChapterSimple();
        simple.id = value.id;
        simple.number = value.number;
        simple.title = value.title!;
        simple.release = value.release!;
        this.chapterList.push(simple);
      }
      this.stopCreateChapter()
    })
  }

  public submitChapter(data:{title: string, text:string}) {
    if (this.chapter.id) this.editChapter(data);
    else this.createChapter(data);
  }

  private editChapter(data:{title:string, text:string}) {
    this.chapter.title = data.title;
    this.chapter.text = data.text;
    this.chapterService.editChapter(this.chapter).subscribe(value => {
      if (this.chapterList) {
        let i = this.chapterList!.findIndex((chapter) => {
          return chapter.id == this.chapter.id;
        });
        this.chapterList![i].title = this.chapter.title!;
      }
      this.stopCreateChapter();
    });
  }
}
