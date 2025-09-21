import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Post } from '../../../models/post.type';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.type';
import { UserService } from '../../../services/user/user';

@Component({
  selector: 'app-post-item',
  imports: [RouterLink, FormsModule],
  templateUrl: './post-item.html',
})
export class PostItem {
  @Input() post!: Post;
  @Input() commentsCount: number = 0;
  @Input() user: User | undefined;

  userService = inject(UserService);
  getAvatarUrl(userId?: number): string {
    return this.userService.getAvatarUrl(userId);
  }
}
