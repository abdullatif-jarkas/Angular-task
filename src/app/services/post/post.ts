import { inject, Injectable, signal, effect, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../../models/post.type';
import { Comment } from '../../models/comment.type';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly postsUrl = 'https://jsonplaceholder.typicode.com/posts';
  private readonly usersUrl = 'https://jsonplaceholder.typicode.com/users';
  private readonly LIKES_KEY = 'post_likes';
  private readonly BOOKMARKS_KEY = 'post_bookmarks';
  private readonly http = inject(HttpClient);

  posts = signal<Post[] | null>(null);
  users = signal<any[] | null>(null);
  bookmarks = signal<{ postId: number; userId: string }[]>(this.loadBookmarks());
  postsWithUsers = signal<(Post & { user: any })[]>([]);

  constructor() {
    effect(() => {
      const posts = this.posts();
      const users = this.users();
      if (posts && users) {
        this.postsWithUsers.set(
          this.shuffleArray(
            posts.map((post) => ({
              ...post,
              user: users.find((u) => u.id === post.userId),
            }))
          )
        );
      }
    });
  }

  getPosts() {
    if (this.posts()) return of(this.posts());
    return this.http.get<Post[]>(this.postsUrl).pipe(
      tap((posts) => this.posts.set(posts))
    );
  }

  getUsers() {
    if (this.users()) return of(this.users());
    return this.http.get<any[]>(this.usersUrl).pipe(
      tap((users) => this.users.set(users))
    );
  }

  getPostById(postId: number): Observable<Post> {
    const cachedPost = this.posts()?.find((p) => p.id === postId);
    if (cachedPost) return of(cachedPost);
    return this.http.get<Post>(`${this.postsUrl}/${postId}`);
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsUrl}?userId=${userId}`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.postsUrl, post);
  }

  updatePost(id: number, data: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.postsUrl}/${id}`, data);
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.postsUrl}/${postId}`);
  }

  mostLikedPosts = computed(() => {
    const posts = this.postsWithUsers();
    const likes = this.loadLikes();
    if (!posts) return [];
    const likeCountMap: Record<number, number> = {};
    likes.forEach((like) => {
      likeCountMap[like.postId] = (likeCountMap[like.postId] || 0) + 1;
    });
    return posts
      .map((post) => ({
        post,
        likes: likeCountMap[post.id] || 0,
      }))
      .sort((a, b) => b.likes - a.likes);
  });

  topAuthors = computed(() => {
    const posts = this.posts() ?? [];
    const likes = this.loadLikes();
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
      if (!authorMap[post.userId])
        authorMap[post.userId] = { userId: post.userId, likes: 0, posts: [] };
      authorMap[post.userId].likes += postLikes;
      authorMap[post.userId].posts.push(post);
    });

    return Object.values(authorMap).sort((a, b) => b.likes - a.likes);
  });

  toggleBookmark(postId: number, userId: string): boolean {
    const current = this.bookmarks();
    const index = current.findIndex(
      (b) => b.postId === postId && b.userId === userId
    );
    let result: boolean;
    if (index > -1) {
      this.bookmarks.set(current.filter((_, i) => i !== index));
      result = false;
    } else {
      this.bookmarks.set([...current, { postId, userId }]);
      result = true;
    }
    this.saveBookmarks();
    return result;
  }

  getUserBookmarks(userId: string): number[] {
    return this.bookmarks()
      .filter((b) => b.userId === userId)
      .map((b) => b.postId);
  }

  getSavedPosts(userId: string): Observable<Post[]> {
    const savedIds = this.getUserBookmarks(userId);
    if (savedIds.length === 0) return of([]);
    const posts = this.postsWithUsers();
    if (!posts) return of([]);
    return of(posts.filter((p) => savedIds.includes(p.id)));
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.postsUrl}/${postId}/comments`);
  }

  getCommentsCount(postId: number): Observable<number> {
    return this.http
      .get<any[]>(`${this.postsUrl}/${postId}/comments`)
      .pipe(map((comments) => comments.length));
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private loadLikes(): { postId: number; userId: string }[] {
    const stored = localStorage.getItem(this.LIKES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private loadBookmarks(): { postId: number; userId: string }[] {
    const stored = localStorage.getItem(this.BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveBookmarks() {
    localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(this.bookmarks()));
  }
}
