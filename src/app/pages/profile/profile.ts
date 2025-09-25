import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth';
import { Post } from '../../models/post.type';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private auth = inject(AuthService);
  private http = inject(HttpClient);

  user: any = null;
  posts: Post[] = [];
  loading = true;

  ngOnInit(): void {
    this.user = this.auth.getUser();

    if (this.user) {
      this.http
        .get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${this.user.id}`)
        .subscribe({
          next: (data) => {
            this.posts = data;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching posts', err);
            this.loading = false;
          },
        });
    } else {
      this.loading = false;
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/default-avatar.png';
  }
}
