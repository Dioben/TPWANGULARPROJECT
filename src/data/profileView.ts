import {Book} from "./book";

export class ProfileView{
  acc_owner!:{username:string,email:string};
  books!: Book[];
  bookmarks!: Book[];
}
