import { Component, inject, OnInit, signal } from '@angular/core';
import { PostService } from '../../services/post';
import { Post } from '../../models/post.type';
import { Hero } from "../../components/hero/hero";
import { PostsList } from "../../components/posts-list/posts-list";
import { RecentPosts } from '../../components/recent-posts/recent-posts';
import { TextField } from '../../components/text-field/text-field';

@Component({
  selector: 'app-home',
  imports: [Hero, PostsList, RecentPosts, TextField],
  templateUrl: './home.html',
})

export class Home implements OnInit {
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
