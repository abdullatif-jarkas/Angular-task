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

  popularPosts: { post: Post; likes: number }[] = [];
  loading = true;

  ngOnInit() {
    this.postService.getPosts().subscribe((posts) => {
      this.popularPosts = this.postService.getMostLikedPosts(posts, 10);
      this.loading = false;
      console.log(this.popularPosts)
    });
  }
}
