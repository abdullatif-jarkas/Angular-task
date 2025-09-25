import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post/post';
import { Post } from '../../models/post.type';
import { UserService } from '../../services/user/user';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './user-page.html',
  styleUrls: ['./user-page.css'],
})
export class UserPage implements OnInit {
  private userService = inject(UserService);
  private postService = inject(PostService);
  private route = inject(ActivatedRoute);

  user = signal<any>(null);
  posts = signal<Post[]>([]);
  loading = signal(true);
  isFollowing = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = Number(params.get('id'));
      if (!userId) return;

      // جلب بيانات المستخدم
      this.userService.getUserById(userId).subscribe((u) => {
        this.user.set({
          ...u,
          avatar: this.userService.getAvatarUrl(u.id),
        });
      });

      // جلب بوستات المستخدم
      this.postService.getPostsByUserId(userId).subscribe((data) => {
        this.posts.set(data);
        this.loading.set(false);
      });
    });
  }

  toggleFollow() {
    this.isFollowing.update((prev) => !prev);
  }
}
