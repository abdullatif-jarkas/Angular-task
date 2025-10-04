import { inject, Injectable, signal } from '@angular/core';
import { Post } from '../../models/post.type';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of, tap } from 'rxjs';
import { Comment } from '../../models/comment.type';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly postsUrl = 'https://jsonplaceholder.typicode.com/posts';
  private readonly usersUrl = 'https://jsonplaceholder.typicode.com/users';
  private readonly http = inject(HttpClient);
  private readonly LIKES_KEY = 'post_likes';
  private readonly BOOKMARKS_KEY = 'post_bookmarks';

  posts = signal<Post[] | null>(null);
  users = signal<any[] | null>(null);

  getPosts(): Observable<Post[]> {
    const cached = this.posts();
    if (cached) {
      return of(cached);
    }

    return this.http
      .get<Post[]>(this.postsUrl)
      .pipe(tap((posts) => this.posts.set(posts)));
  }

  getUsers(): Observable<any[]> {
    const cached = this.users();
    if (cached) {
      return of(cached);
    }

    return this.http
      .get<any[]>(this.usersUrl)
      .pipe(tap((users) => this.users.set(users)));
  }

  getPostsWithUsers(): Observable<(Post & { user: any })[]> {
    return forkJoin([this.getPosts(), this.getUsers()]).pipe(
      map(([posts, users]) => {
        const merged = posts.map((post) => ({
          ...post,
          user: users.find((u) => u.id === post.userId),
        }));
        return this.shuffleArray(merged); // 🔹 هنا نعمل shuffle
      })
    );
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getPostsByUserId(userId: number) {
    return this.http.get<Post[]>(`${this.postsUrl}?userId=${userId}`);
  }

  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.postsUrl}/${postId}`);
  }

  getMostLikedPosts(
    allPosts: (Post & { user?: any })[],
    limit: number = 10
  ): { post: Post & { user: any }; likes: number }[] {
    const stored = localStorage.getItem(this.LIKES_KEY);
    const likes: { postId: number; userId: string }[] = stored
      ? JSON.parse(stored)
      : [];

    const likeCountMap: Record<number, number> = {};
    likes.forEach((like) => {
      likeCountMap[like.postId] = (likeCountMap[like.postId] || 0) + 1;
    });

    const withLikes = allPosts.map((post) => ({
      post: { ...post, user: post.user! }, // نضمن أن user موجود
      likes: likeCountMap[post.id] || 0,
    }));

    return withLikes.sort((a, b) => b.likes - a.likes).slice(0, limit);
  }

  getTopAuthors(
    posts: Post[],
    limit: number = 5
  ): { userId: number; likes: number; posts: Post[] }[] {
    const stored = localStorage.getItem(this.LIKES_KEY);
    const likes: { postId: number; userId: string }[] = stored
      ? JSON.parse(stored)
      : [];

    const likeCountMap: Record<number, number> = {};
    likes.forEach((like) => {
      likeCountMap[like.postId] = (likeCountMap[like.postId] || 0) + 1;
    });

    const authorMap: Record<
      number,
      { userId: number; likes: number; posts: Post[] }
    > = {};

    posts.forEach((post) => {
      const postLikes = likeCountMap[post.id] || 0;
      if (!authorMap[post.userId]) {
        authorMap[post.userId] = { userId: post.userId, likes: 0, posts: [] };
      }
      authorMap[post.userId].likes += postLikes;
      authorMap[post.userId].posts.push(post);
    });

    return Object.values(authorMap)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit);
  }

  getBookmarks(): { postId: number; userId: string }[] {
    const stored = localStorage.getItem(this.BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getSavedPosts(userId: string): Observable<Post[]> {
    const savedIds = this.getUserBookmarks(userId);

    if (savedIds.length === 0) {
      return new Observable<Post[]>((observer) => {
        observer.next([]);
        observer.complete();
      });
    }

    return this.getPosts().pipe(
      map((posts) => posts.filter((p) => savedIds.includes(p.id)))
    );
  }

  saveBookmarks(bookmarks: { postId: number; userId: string }[]) {
    localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }

  toggleBookmark(postId: number, userId: string): boolean {
    let bookmarks = this.getBookmarks();
    const index = bookmarks.findIndex(
      (b) => b.postId === postId && b.userId === userId
    );

    if (index > -1) {
      bookmarks.splice(index, 1);
      this.saveBookmarks(bookmarks);
      return false;
    } else {
      bookmarks.push({ postId, userId });
      this.saveBookmarks(bookmarks);
      return true;
    }
  }

  getUserBookmarks(userId: string): number[] {
    return this.getBookmarks()
      .filter((b) => b.userId === userId)
      .map((b) => b.postId);
  }

  getCommentsCount(postId: number) {
    return this.http.get<any[]>(`${this.postsUrl}/${postId}/comments`);
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.postsUrl, post);
  }

  deletePost = (postId: number) => {
    return this.http.delete(
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
  };

  updatePost(id: number, data: Partial<Post>) {
    return this.http.put<Post>(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      data
    );
  }
}
