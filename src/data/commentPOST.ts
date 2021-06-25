export class CommentPOST{
  id?:number;
  content!: string;
  chapter!: number;
  parent!: number|null;
}
