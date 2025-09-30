import { Component, inject, Input } from '@angular/core';
import { Comment } from '../../../models/comment.type';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-comment-item',
  imports: [TranslatePipe, NgClass],
  templateUrl: './comment-item.html',
})
export class CommentItem {
  @Input() commentItem!: Comment;

  translate = inject(TranslateService)
}
