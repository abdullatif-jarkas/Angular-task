import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post/post';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { ToastrService } from 'ngx-toastr';
import { Post } from '../../models/post.type';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-write-post',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslatePipe],
  templateUrl: './write-post.html',
})
export class WritePost implements OnInit {
  private postService = inject(PostService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  translate = inject(TranslateService);

  title: string = '';
  body: string = '';
  editing = false;
  postId?: number;

  constructor() {
    const router = inject(Router);
    const nav = router.getCurrentNavigation();
    const post = nav?.extras?.state?.['post'] as Post | undefined;

    if (post) {
      this.editing = true;
      this.postId = post.id;
      this.title = post.title;
      this.body = post.body;
    }
  }

  ngOnInit(): void {
    if (!this.postId) {
      this.postId = Number(this.route.snapshot.paramMap.get('id'));
      if (this.postId) {
        this.editing = true;
        this.postService.getPostById(this.postId).subscribe({
          next: (data: Post) => {
            this.title = data.title;
            this.body = data.body;
          },
          error: () => {
            this.toastr.error('Failed to load post data', 'Error');
            this.router.navigate(['/']);
          },
        });
      }
    }
  }

  onSubmit() {
    if (!this.title.trim() || !this.body.trim()) {
      this.toastr.warning('Please fill in all fields', 'Warning');
      return;
    }

    const currentUser = this.authService.getUser();
    if (!currentUser?.id) {
      this.toastr.error('You must be logged in', 'Error');
      return;
    }

    if (this.editing && this.postId) {
      this.postService
        .updatePost(this.postId, { title: this.title, body: this.body })
        .subscribe({
          next: () => {
            this.toastr.success('Post updated successfully!', 'Success');
            this.router.navigate(['/profile']);
          },
          error: () => {
            this.toastr.error('Something went wrong while updating', 'Error');
          },
        });
    } else {
      const newPost: Post = {
        userId: Number(currentUser.id),
        id: Date.now(),
        title: this.title,
        body: this.body,
      };

      this.postService.createPost(newPost).subscribe({
        next: () => {
          this.toastr.success('Post created successfully!', 'Success');
          this.router.navigate(['/']);
        },
        error: () => {
          this.toastr.error(
            'Something went wrong while creating the post',
            'Error'
          );
        },
      });
    }
  }
}
