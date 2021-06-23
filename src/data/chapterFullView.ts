import {Chapter} from "./chapter";
import {Author} from "./author";

export class ChapterFullView{
  author?: Author;
  chapter!: Chapter;
  comments?: Comment[];
  pages?: number;

}
