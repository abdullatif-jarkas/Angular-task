import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post/post';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-write-post',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './write-post.html',
  styleUrl: './write-post.css',
})
export class WritePost {
  private postService = inject(PostService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  title: string = '';
  body: string = '';

  onSubmit() {
    if (!this.title.trim() || !this.body.trim()) {
      this.toastr.warning('Please fill in all fields', 'Warning');
      return;
    }

    const currentUser = this.authService.getUser();
    if (!currentUser?.id) {
      this.toastr.error('You must be logged in to create a post', 'Error');
      return;
    }

    const newPost = {
      userId: Number(currentUser.id),
      id: Date.now(),
      title: this.title,
      body: this.body,
    };

    this.postService.createPost(newPost).subscribe({
      next: (post) => {
        console.log('Post created:', post);
        this.toastr.success('Post created successfully!', 'Success');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error creating post:', err);
        this.toastr.error('Something went wrong while creating the post', 'Error');
      },
    });
  }
}
