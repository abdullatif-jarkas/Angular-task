import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private readonly http = inject(HttpClient);

  getUserById(userId: number) {
    return this.http
      .get<{ name: string; id: number }>(`${this.apiUrl}/${userId}`)
      .pipe(
        map((user) => ({
          id: user.id,
          name: user.name,
        }))
      );
  }

  getAvatarUrl(userId?: number): string {
    if (!userId) return 'https://via.placeholder.com/40';
    return `https://i.pravatar.cc/150?u=${userId}`;
  }
}
