export class Comment{
  id!: number;
  author_name!: string;
  content!: string;
  release?: string;
  author?: number;
  chapter?: number;
  parent!: number|null;
}
