export class BookPOST{
  id?: number;
  title!: string;
  description!: string;
  cover: File|undefined|null;
}
