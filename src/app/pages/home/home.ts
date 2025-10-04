import { Component, inject, OnInit, signal } from '@angular/core';
import { PostService } from '../../services/post/post';
import { Post } from '../../models/post.type';
import { PostItem } from '../../shared/components/post-item/post-item';
@Component({
  selector: 'app-home',
  imports: [PostItem],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private postService = inject(PostService);

  posts = signal<(Post & { user: any })[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.postService.getPostsWithUsers().subscribe((posts) => {
      this.posts.set(posts);
      this.loading.set(false);
    });
  }
}
