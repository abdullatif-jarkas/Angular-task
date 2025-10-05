import { Component, inject, signal, effect } from '@angular/core';
import { PostService } from '../../services/post/post';
import { Post } from '../../models/post.type';
import { PostItem } from '../../shared/components/post-item/post-item';

@Component({
  selector: 'app-home',
  imports: [PostItem],
  templateUrl: './home.html',
})
export class Home {
  private postService = inject(PostService);

  posts = signal<(Post & { user: any })[]>([]);
  loading = signal(true);

  constructor() {
    this.postService.getPosts().subscribe();
    this.postService.getUsers().subscribe();

    effect(() => {
      const posts = this.postService.postsWithUsers();
      if (posts.length > 0) {
        this.posts.set(posts);
        this.loading.set(false);
      }
    });
  }
}
