export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
  commentsCount?: number;
  user?: {
  id: number;
  name: string;
};
};
