import { Injectable } from '@angular/core';
import { User } from '../../models/user.type';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly USERS_KEY = 'users';

  login(email: string, password: string): boolean {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      localStorage.setItem(this.TOKEN_KEY, 'fake-jwt-token');
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      return true;
    }

    return false;
  }

  signup(name: string, email: string, password: string): boolean {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    if (users.some((u) => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      email,
      password,
      role: 'user',
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    localStorage.setItem(this.TOKEN_KEY, 'fake-jwt-token');
    localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));

    return true;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): Omit<User, 'password'> | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;

    const { password, ...userResponse } = JSON.parse(userJson) as User;
    return userResponse;
  }

  getUserId(): string | null {
    return this.getUser()?.id ?? null;
  }

  userRole(): 'admin' | 'user' {
    return this.getUser()?.role ?? 'user';
  }
}
