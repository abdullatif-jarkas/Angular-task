import { Component, inject, OnInit, signal } from '@angular/core';
import { Post } from '../../models/post.type';
import { Comment } from '../../models/comment.type';
import { PostService } from '../../services/post/post';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommentItem } from '../../shared/components/comment-item/comment-item';
import { NgClass } from '@angular/common';
import { UserService } from '../../services/user/user';

@Component({
  selector: 'app-post-details',
  imports: [CommentItem, NgClass, RouterLink],
  templateUrl: './post-details.html',
})
export class PostDetails implements OnInit {
  post = signal<Post>({} as Post);
  comments = signal<Comment[]>([]);
  suggestedPosts = signal<Post[]>([]);
  loading = signal(true);
  saved = signal(false);

  // user info signals
  userName = signal<string | null>(null);
  userId = signal<number | null>(null);
  avatarUrl = signal<string>(this.getDefaultAvatar());

  route = inject(ActivatedRoute);
  postService = inject(PostService);
  userService = inject(UserService);

  toggleBookmark = () => {
    this.saved.update((prev) => !prev);
  };

  sharePost = () => {
    if (navigator.share) {
      navigator
        .share({
          title: this.post().title,
          text: this.post().body,
          url: window.location.href,
        })
        .then(() => console.log('Post shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      alert(
        'Sharing not supported in this browser. You can copy the URL instead.'
      );
    }
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const postId = Number(params.get('id'));

      this.postService.getPostById(postId).subscribe((post) => {
        this.post.set(post);
        this.loading.set(false);

        // بعد جلب البوست: جلب بيانات المستخدم حسب userId الموجود في البوست
        if (post?.userId) {
          this.fetchUserInfo(post.userId);
        } else {
          // إعادة القيمة الافتراضية في حال لم يكن هناك userId
          this.userName.set(null);
          this.userId.set(null);
          this.avatarUrl.set(this.getDefaultAvatar());
        }
      });

      this.postService.getCommentsByPostId(postId).subscribe((data) => {
        this.comments.set(data);
      });

      this.postService.getSuggestedPosts(postId).subscribe((suggested) => {
        this.suggestedPosts.set(suggested);
      });
    });
  }

  private fetchUserInfo(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        // UserService يرجع { id, name } حسب تعريفك
        this.userName.set(user.name);
        this.userId.set(user.id);
        this.avatarUrl.set(this.userService.getAvatarUrl(user.id));
      },
      error: (err) => {
        console.error('Failed to load user info', err);
        this.userName.set(null);
        this.userId.set(null);
        this.avatarUrl.set(this.getDefaultAvatar());
      },
    });
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.getDefaultAvatar();
  }

  private getDefaultAvatar() {
    return 'assets/images/default-avatar.png';
  }
}
