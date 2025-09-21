import { Component, inject, OnInit, signal } from '@angular/core';
import { Post } from '../../models/post.type';
import { Comment } from '../../models/comment.type';
import { PostService } from '../../services/post/post';
import { ActivatedRoute } from '@angular/router';
import { PostItem } from '../../shared/components/post-item/post-item';
import { CommentItem } from '../../shared/components/comment-item/comment-item';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-post-details',
  imports: [CommentItem, NgClass],
  templateUrl: './post-details.html',
})
export class PostDetails implements OnInit {
  post = signal<Post>({} as Post);
  comments = signal<Comment[]>([]);
  suggestedPosts = signal<Post[]>([]);
  loading = signal(true);
  saved = signal(false);

  route = inject(ActivatedRoute);
  postService = inject(PostService);

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
      });

      this.postService.getCommentsByPostId(postId).subscribe((data) => {
        this.comments.set(data);
      });

      this.postService.getSuggestedPosts(postId).subscribe((suggested) => {
        this.suggestedPosts.set(suggested);
      });
    });
  }
}
