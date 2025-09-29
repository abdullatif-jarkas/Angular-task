import { Component, inject } from '@angular/core';
import { Post } from '../../models/post.type';
import { PostService } from '../../services/post/post';
import { UserService } from '../../services/user/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-authors',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './top-authors.html',
  styleUrls: ['./top-authors.css'],
})
export class TopAuthors {
  private postService = inject(PostService);
  private userService = inject(UserService);

  topAuthors: {
    id: number;
    name: string;
    avatar: string;
    likes: number;
    posts: Post[];
  }[] = [];
  loading = true;

  ngOnInit() {
    this.postService.getPosts().subscribe((posts) => {
      const authorsStats = this.postService.getTopAuthors(posts, 5);

      authorsStats.forEach((author) => {
        this.userService.getUserById(author.userId).subscribe((user) => {
          this.topAuthors.push({
            id: user.id,
            name: user.name,
            avatar: this.userService.getAvatarUrl(user.id),
            likes: author.likes,
            posts: author.posts,
          });

          this.topAuthors.sort((a, b) => b.likes - a.likes);
          this.loading = false;
        });
      });
    });
  }
}
