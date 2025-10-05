import { Component, inject } from '@angular/core';
import { Post } from '../../models/post.type';
import { PostItem } from '../../shared/components/post-item/post-item';
import { PostService } from '../../services/post/post';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-popular',
  standalone: true,
  imports: [PostItem, TranslatePipe, NgClass],
  templateUrl: './popular.html',
  styleUrls: ['./popular.css'],
})
export class Popular {
  private postService = inject(PostService);
  translate = inject(TranslateService);

  popularPosts: { post: Post & { user: any }; likes: number }[] = [];
  loading = true;

  ngOnInit() {
    this.popularPosts = this.postService.mostLikedPosts().slice(0, 10);
    this.loading = false;
  }
}
