export class Comment{
  id!: number;
  author_name!: string;
  content!: string;
  release?: string;
  author?: 2;
  chapter?: 1;
  parent!: number|null;
}
