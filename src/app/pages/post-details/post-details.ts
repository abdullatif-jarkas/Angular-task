import { Component, inject, OnInit, signal } from '@angular/core';
import { Post } from '../../models/post.type';
import { Comment } from '../../models/comment.type';
import { PostService } from '../../services/post';
import { ActivatedRoute } from '@angular/router';
import { PostItem } from '../../components/post-item/post-item';
import { CommentItem } from '../../components/comment-item/comment-item';

@Component({
  selector: 'app-post-details',
  imports: [PostItem, CommentItem],
  templateUrl: './post-details.html',
})
export class PostDetails implements OnInit {
  post = signal<Post>({} as Post);
  comments = signal<Comment[]>([]);
  suggestedPosts = signal<Post[]>([]);

  route = inject(ActivatedRoute);
  postService = inject(PostService);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {

      const postId = Number(params.get('id'));

      this.postService.getPostById(postId).subscribe((post) => {
        this.post.set(post);
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
