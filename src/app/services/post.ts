import { inject, Injectable } from '@angular/core';
import { Post } from '../models/post.type';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Comment } from '../models/comment.type';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  private readonly http = inject(HttpClient);

  getPosts() {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${postId}`);
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );
  }

  getSuggestedPosts(postId: number): Observable<Post[]> {
    return this.getPosts().pipe(
      map((posts) =>
        posts.filter((post) => post.id !== postId).slice(0, 3)
      )
    );
  }

  deletePost = (postId: number) => {
    return this.http.delete(
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
  };

  updatePost(post: Post) {
    return this.http.put(`https://jsonplaceholder.typicode.com/posts/${post.id}`, post);
  }
}
