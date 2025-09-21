import { User } from "./user.type";

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
  commentsCount: number;
  user?: User;
};
