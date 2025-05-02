import { makeAutoObservable } from 'mobx';
import { authService } from '../services/authService';

class UserStore {
  user = null;
  isLoading = true;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user) {
    this.user = user;
  }

  async init() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const user = await authService.getMe();
        this.setUser(user);
      } catch (error) {
        console.warn('Ошибка получения пользователя:', error);
        localStorage.removeItem('access_token');
      }
    }
    this.isLoading = false;
  }

  logout() {
    this.user = null;
    localStorage.removeItem('access_token');
  }
}

export const userStore = new UserStore();
