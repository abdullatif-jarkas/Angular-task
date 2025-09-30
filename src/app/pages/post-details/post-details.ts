import { Component, inject, OnInit, signal } from '@angular/core';
import { Post } from '../../models/post.type';
import { Comment } from '../../models/comment.type';
import { PostService } from '../../services/post/post';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommentItem } from '../../shared/components/comment-item/comment-item';
import { NgClass } from '@angular/common';
import { UserService } from '../../services/user/user';
import { AuthService } from '../../services/auth/auth';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-post-details',
  imports: [CommentItem, NgClass, RouterLink, TranslatePipe],
  templateUrl: './post-details.html',
})
export class PostDetails implements OnInit {
  post = signal<Post>({} as Post);
  comments = signal<Comment[]>([]);
  suggestedPosts = signal<Post[]>([]);
  loading = signal(true);
  saved = signal(false);

  userName = signal<string | null>(null);
  userId = signal<number | null>(null);
  avatarUrl = signal<string>(this.getDefaultAvatar());
  following = signal(false);

  route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private userService = inject(UserService);
  authService = inject(AuthService);
  translate = inject(TranslateService);

  currentUserId: number | null = null;

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

        const currentUserId = localStorage.getItem('id')!;
        const userBookmarks = this.postService.getUserBookmarks(currentUserId);
        this.saved.set(userBookmarks.includes(post.id));
        this.loadBookmark();

        if (post?.userId) {
          this.fetchUserInfo(post.userId);
        } else {
          this.userName.set(null);
          this.userId.set(null);
          this.avatarUrl.set(this.getDefaultAvatar());
        }
      });

      this.postService.getCommentsByPostId(postId).subscribe((data) => {
        console.log('post: ', data);
        this.comments.set(data);
      });

      this.postService.getSuggestedPosts(postId).subscribe((suggested) => {
        this.suggestedPosts.set(suggested);
      });
    });
  }

  loadBookmark() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const userBookmarks = this.postService.getUserBookmarks(userId);
    this.saved.set(userBookmarks.includes(this.post().id));
  }
  toggleBookmark = () => {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const bookmarked = this.postService.toggleBookmark(this.post().id, userId);
    this.saved.set(bookmarked);
  };
  fetchUserInfo(userId: number) {
    this.userService.getUserById(userId).subscribe((user) => {
      this.userId.set(user.id);
      this.userName.set(user.name);
      this.avatarUrl.set(this.userService.getAvatarUrl(user.id));

      const currentUser = this.authService.getUser();
      if (currentUser?.id) {
        this.following.set(
          this.userService.isFollowing(user.id, Number(currentUser.id))
        );
      }
    });
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.getDefaultAvatar();
  }

  private getDefaultAvatar() {
    return 'images/default-avatar.png';
  }
  toggleFollow() {
    const currentUser = this.authService.getUser();
    if (!currentUser?.id || !this.userId()) return;

    const newState = this.userService.toggleFollow(
      this.userId()!,
      Number(currentUser.id)
    );
    this.following.set(newState);
  }
}
