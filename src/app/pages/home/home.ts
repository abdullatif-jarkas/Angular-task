import { Component, inject, OnInit, signal } from '@angular/core';
import { PostService } from '../../services/post/post';
import { Post } from '../../models/post.type';
import { PostItem } from '../../shared/components/post-item/post-item';
import { UserService } from '../../services/user/user';
@Component({
  selector: 'app-home',
  imports: [PostItem],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  postService = inject(PostService);
  UserService = inject(UserService);
  posts = signal<Post[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.postService.getPosts().subscribe((posts) => {
      this.posts.set(posts);

      posts.forEach((post) => {
        this.postService.getCommentsCount(post.id).subscribe((comments) => {
          const updatedPosts = this.posts().map((p) =>
            p.id === post.id ? { ...p, commentsCount: comments.length } : p
          );
          this.posts.set(updatedPosts);
        });

        this.UserService.getUserById(post.userId).subscribe((user) => {
          const updatedPosts = this.posts().map((p) =>
            p.id === post.id ? { ...p, user } : p
          );
          this.posts.set(updatedPosts);
        });
      });

      this.loading.set(false)
    });
  }
}
