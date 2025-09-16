import { Component, inject, Input, input, OnInit, signal } from '@angular/core';
import { PostService } from '../../services/post';
import { Post } from '../../models/post.type';
import { PostItem } from '../post-item/post-item';

@Component({
  selector: 'app-recent-posts',
  imports: [PostItem],
  templateUrl: './recent-posts.html',
})
export class RecentPosts implements OnInit {
  postService = inject(PostService);
  posts = signal<Post[]>([]);
  
  ngOnInit(): void {
    this.postService.getPosts().subscribe((posts) => {
      this.posts.set(posts);
    });
  }
  get recentPosts() {
    return this.posts().slice(0, 4);
  }
}
