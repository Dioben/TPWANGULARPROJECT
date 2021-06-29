import {Chapter} from "./chapter";
import {Author} from "./author";
import {Comment} from "./comment";

export class ChapterFullView{
  author?: Author;
  chapter!: Chapter;
  comments?: Comment[];
  pages?: number;

}
