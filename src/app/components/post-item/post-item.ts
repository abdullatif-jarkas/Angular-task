import { Component, inject, Input, signal } from '@angular/core';
import { Post } from '../../models/post.type';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { PostService } from '../../services/post';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-item',
  imports: [RouterLink, NgClass, FormsModule],
  templateUrl: './post-item.html',
})
export class PostItem {
  @Input() post!: Post;
  @Input() recentRight!: boolean;
  postService = inject(PostService);
  toastService = inject(ToastrService);

  editPopupOpen = signal<boolean>(false);
  menuOpen = signal<boolean>(false);

  editTitle: string = '';
  editBody: string = '';

  toggleMenu() {
    this.menuOpen.update((prev) => !prev);
  }

  editPost() {
    this.menuOpen.set(false);
  }

  //? Edit
  openEditPopup() {
    this.editTitle = this.post.title;
    this.editBody = this.post.body;
    this.editPopupOpen.set(true);
    this.menuOpen.set(false);
  }

  closeEditPopup() {
    this.editPopupOpen.set(false);
  }

  submitEdit(event: Event) {
    event.preventDefault();
    const updatedPost: Post = {
      ...this.post,
      title: this.editTitle,
      body: this.editBody,
    };
    this.postService.updatePost(updatedPost).subscribe(() => {
      console.log('Post updated', updatedPost);
      this.post.title = updatedPost.title;
      this.post.body = updatedPost.body;
      this.editPopupOpen.set(false);
      this.toastService.success('Post updated successfully', 'Success');
    });
  }

  //! Delete
  deletePost() {
    this.postService.deletePost(this.post.id).subscribe(() => {
      this.menuOpen.set(false);
      this.toastService.success('Post deleted successfully', 'Success');
    });
  }
}
