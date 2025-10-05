import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostItem } from '../../shared/components/post-item/post-item';
import { PostService } from '../../services/post/post';
import { AuthService } from '../../services/auth/auth';
import { Post } from '../../models/post.type';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [CommonModule, PostItem, TranslatePipe],
  templateUrl: './saved.html',
})
export class Saved implements OnInit {
  private postService = inject(PostService);
  private authService = inject(AuthService);
  translate = inject(TranslateService);

  savedPosts: Post[] = [];
  currentUserId: string | null = null;

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();

    if (this.currentUserId) {
      this.postService.getSavedPosts(this.currentUserId).subscribe({
        next: (posts) => (this.savedPosts = posts),
        error: (err) => console.error('Error loading saved posts:', err),
      });
    }
  }
}
