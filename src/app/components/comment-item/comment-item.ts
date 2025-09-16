import { Component, Input } from '@angular/core';
import { Comment } from '../../models/comment.type';

@Component({
  selector: 'app-comment-item',
  imports: [],
  templateUrl: './comment-item.html',
})
export class CommentItem {
  @Input() commentItem!: Comment;
}
