import {Book} from "./book";
import {Review} from "./review";
import {ChapterSimple} from "./chapter";

export class BookFullView {
  book!:Book;
  self_review?: Review;
  lastread?: number;
  bookmarked?: boolean;
  chapters!: ChapterSimple[];
  reviews?: Review[];
  rating?: number;
  pages?: number;
}
