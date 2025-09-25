import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Post } from '../../../models/post.type';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../services/auth/auth';
import { PostService } from '../../../services/post/post';

@Component({
  selector: 'app-post-item',
  imports: [RouterLink, FormsModule, NgClass],
  templateUrl: './post-item.html',
})
export class PostItem implements OnInit {
  @Input() post!: Post;
  @Input() commentsCount: number = 0;
  @Input() user: { id: number; name: string } | undefined;

  saved = signal(false);
  liked = signal(false);
  likesCount = signal(0);

  private readonly LIKES_KEY = 'post_likes';

  authService = inject(AuthService);
  userService = inject(UserService);
  postService = inject(PostService);

  ngOnInit() {
    this.loadLikes();
    this.loadBookmark();
  }

  loadLikes() {
    const stored = localStorage.getItem(this.LIKES_KEY);
    const likes: { postId: number; userId: string }[] = stored
      ? JSON.parse(stored)
      : [];

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.liked.set(
      likes.some((l) => l.postId === this.post.id && l.userId === userId)
    );

    this.likesCount.set(likes.filter((l) => l.postId === this.post.id).length);
  }

  toggleLike() {
    console.log('toggleLike clicked!', this.post.id);

    const stored = localStorage.getItem(this.LIKES_KEY);
    let likes: { postId: number; userId: string }[] = stored
      ? JSON.parse(stored)
      : [];
    const userId = this.authService.getUserId();
    console.log('Current userId:', userId);
    if (!userId) return;

    const likeIndex = likes.findIndex(
      (l) => l.postId === this.post.id && l.userId === userId
    );

    if (likeIndex > -1) {
      likes.splice(likeIndex, 1);
      this.liked.set(false);
    } else {
      likes.push({ postId: this.post.id, userId });
      this.liked.set(true);
    }

    localStorage.setItem(this.LIKES_KEY, JSON.stringify(likes));
    this.likesCount.set(likes.filter((l) => l.postId === this.post.id).length);

    console.log('liked:', this.liked(), 'likesCount:', this.likesCount());
  }

  loadBookmark() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const userBookmarks = this.postService.getUserBookmarks(userId);
    this.saved.set(userBookmarks.includes(this.post.id));
  }

  toggleBookmark = () => {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const bookmarked = this.postService.toggleBookmark(this.post.id, userId);
    this.saved.set(bookmarked);
  };

  getAvatarUrl(userId?: number): string {
    return this.userService.getAvatarUrl(userId);
  }
}
