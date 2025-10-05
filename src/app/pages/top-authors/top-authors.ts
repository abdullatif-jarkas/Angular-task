import { Component, inject } from '@angular/core';
import { Post } from '../../models/post.type';
import { PostService } from '../../services/post/post';
import { UserService } from '../../services/user/user';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-top-authors',
  standalone: true,
  imports: [RouterLink, TranslatePipe, NgClass],
  templateUrl: './top-authors.html',
  styleUrls: ['./top-authors.css'],
})
export class TopAuthors {
  private postService = inject(PostService);
  private userService = inject(UserService);
  translate = inject(TranslateService);

  topAuthors: {
    id: number;
    name: string;
    avatar: string;
    likes: number;
    posts: Post[];
  }[] = [];
  loading = true;

  ngOnInit() {
    forkJoin({
      posts: this.postService.getPosts(),
      users: this.postService.getUsers(),
    }).subscribe({
      next: ({ posts, users }) => {
        const authorsStats = this.postService.topAuthors().slice(0, 5);

        this.topAuthors = authorsStats
          .map((author) => {
            const user = (users ?? []).find((u) => u.id === author.userId);
            return {
              id: user?.id ?? author.userId,
              name: user?.name ?? `User ${author.userId}`,
              avatar: this.userService.getAvatarUrl(user?.id ?? author.userId),
              likes: author.likes,
              posts: author.posts,
            };
          })
          .sort((a, b) => b.likes - a.likes);

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load top authors', err);
        this.loading = false;
      },
    });
  }
}
