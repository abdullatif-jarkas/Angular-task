import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';

import { UserService } from '../../services/user/user';
import { PostService } from '../../services/post/post';
import { AuthService } from '../../services/auth/auth';
import { Post } from '../../models/post.type';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, NgClass, TranslatePipe],
  templateUrl: './user-page.html',
  styleUrls: ['./user-page.css'],
})
export class UserPage implements OnInit {
  private userService = inject(UserService);
  private postService = inject(PostService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authService = inject(AuthService);
  translate = inject(TranslateService);

  user = signal<any>(null);
  posts = signal<Post[]>([]);
  followers = signal<any[]>([]);
  isFollowing = signal(false);
  followersCount = signal(0);
  loading = signal(true);

  currentUserId: number | null = null;
  openMenuId: number | null = null;

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    this.currentUserId = currentUser ? Number(currentUser.id) : null;

    this.route.paramMap.subscribe((params) => {
      const userId = Number(params.get('id'));
      if (!userId) return;

      this.loadUser(userId);
      this.loadPosts(userId);
    });
  }

  private loadUser(userId: number) {
    this.userService.getUserById(userId).subscribe((u) => {
      this.user.set({ ...u, avatar: this.userService.getAvatarUrl(u.id) });

      if (this.currentUserId) {
        this.isFollowing.set(
          this.userService.isFollowing(u.id, this.currentUserId)
        );
      }

      this.followersCount.set(this.userService.getFollowersCount(u.id));
      this.followers.set(this.userService.getFollowersDetailed(u.id));
    });
  }

  private loadPosts(userId: number) {
    this.postService.getPostsByUserId(userId).subscribe((data) => {
      this.posts.set(data);
      this.loading.set(false);
    });
  }

  toggleFollow() {
    if (!this.currentUserId || !this.user()) return;

    const updatedStatus = this.userService.toggleFollow(
      this.user().id,
      this.currentUserId
    );

    this.isFollowing.set(updatedStatus);
    this.followersCount.set(this.userService.getFollowersCount(this.user().id));
    this.followers.set(this.userService.getFollowersDetailed(this.user().id));
  }

  onEditPost(post: Post) {
    const canEdit =
      this.currentUserId === post.userId ||
      this.authService.userRole() === 'admin';

    if (canEdit) {
      this.router.navigate([`/posts/edit/${post.id}`], { state: { post } });
    } else {
      alert('You do not have permission to edit this post.');
    }
  }


  toggleMenu(postId: number) {
    this.openMenuId = this.openMenuId === postId ? null : postId;
  }

  onDeletePost(post: Post) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(post.id).subscribe(() => {
        this.openMenuId = null;
      });
    }
  }
}
