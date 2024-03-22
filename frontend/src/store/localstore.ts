'use client';

export class LocalStore {
  static get(key: string) {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return '';
  }

  static set(key: string, value: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  static remove(key: 'jwt' | string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

  static clear() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }

  static getJson(key: string) {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }

  static getAccessToken() {
    return this.get('jwt');
  }

  static setAccessToken(token: string) {
    this.set('jwt', token);
  }

  static getVerticalNavBarState() {
    return this.get('state')
  }

  static setVerticalNavBarState(state: string) {
    this.set('state', state)
  }

}