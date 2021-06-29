export class Chapter{
  id!: number;
  book_name!: string;
  title?: string;
  text?: string;
  release?: string;
  number?: number;
  novel?: number;
  book_cover?: string;
  total_chapters?:number;
}
export class ChapterSimple{
  title!: string;
  release!: string;
  number?: number;
}
