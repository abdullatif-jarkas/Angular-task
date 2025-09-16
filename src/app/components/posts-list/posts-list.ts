import { Component, Input, signal } from '@angular/core';
import { Post } from '../../models/post.type';
import { PostItem } from "../post-item/post-item";

@Component({
  selector: 'app-posts-list',
  imports: [PostItem],
  templateUrl: './posts-list.html',
})
export class PostsList {
  @Input() posts: Post[] = [];

  visibleCount = signal<number>(6);

  showMore() {
    this.visibleCount.update(count => count + 6);
  }

  showLess() {
    this.visibleCount.set(6);
  }
}
