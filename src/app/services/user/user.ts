import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'followersMap';

  private loadFollowersMap(): Record<number, number[]> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  private saveFollowersMap(map: Record<number, number[]>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(map));
  }

  getUserById(userId: number) {
    return this.http
      .get<{ id: number; name: string }>(`${this.apiUrl}/${userId}`)
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

  toggleFollow(targetUserId: number, currentUserId: number): boolean {
  if (this.isFollowing(targetUserId, currentUserId)) {
    this.unfollowUser(targetUserId, currentUserId);
    return false;
  } else {
    this.followUser(targetUserId, currentUserId);
    return true;
  }
}


  isFollowing(targetUserId: number, currentUserId: number): boolean {
    const map = this.loadFollowersMap();
    return (map[targetUserId] || []).includes(currentUserId);
  }

  followUser(targetUserId: number, currentUserId: number) {
    const map = this.loadFollowersMap();
    if (!map[targetUserId]) map[targetUserId] = [];

    if (!map[targetUserId].includes(currentUserId)) {
      map[targetUserId].push(currentUserId);
    }

    this.saveFollowersMap(map);
  }

  unfollowUser(targetUserId: number, currentUserId: number) {
    const map = this.loadFollowersMap();
    map[targetUserId] = (map[targetUserId] || []).filter(
      (id) => id !== currentUserId
    );
    this.saveFollowersMap(map);
  }

  getFollowersCount(targetUserId: number): number {
    const map = this.loadFollowersMap();
    return (map[targetUserId] || []).length;
  }

  getFollowers(targetUserId: number): number[] {
    const map = this.loadFollowersMap();
    return map[targetUserId] || [];
  }

  getFollowersDetailed(targetUserId: number) {
    return this.getFollowers(targetUserId).map((id) => ({
      id,
      avatar: this.getAvatarUrl(id),
    }));
  }
}
