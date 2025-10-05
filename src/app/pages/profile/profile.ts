import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth';
import { Post } from '../../models/post.type';
import { Router } from '@angular/router';
import { PostService } from '../../services/post/post';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgClass, TranslatePipe],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  private postService = inject(PostService);
  private router = inject(Router);
  translate = inject(TranslateService);

  user: any = null;
  posts: Post[] = [];
  loading = true;

  openMenuId: number | null = null;

  ngOnInit(): void {
    this.user = this.auth.getUser();

    if (this.user) {
      this.postService.getPostsByUserId(this.user.id).subscribe({
        next: (data) => {
          this.posts = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching posts', err);
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  onEditPost(post: Post) {
    this.router.navigate(['/posts/edit', post.id], {
      state: { post },
    });
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/default-avatar.png';
  }

  toggleMenu(postId: number) {
    this.openMenuId = this.openMenuId === postId ? null : postId;
  }

  onDeletePost(post: Post) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(post.id).subscribe({
        next: () => {
          alert('Post deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting post:', err);
          alert('Failed to delete the post');
        },
      });
    }
  }
}
