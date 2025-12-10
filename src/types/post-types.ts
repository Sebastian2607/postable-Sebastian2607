export interface Post {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  likesCount: number;
}