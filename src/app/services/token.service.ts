import { Injectable } from '@angular/core';
import { StorageConstants } from '../_shared/constants';

@Injectable()
export class TokenService {
  rolesChanged: boolean;

  saveToken(token: string): void {
    this._getStorage().setItem(StorageConstants.JwtToken, token);
    this._markIfRolesChanged(token);
    this.shareSessionStorage();
  }

  getToken(): string {
    return this._getStorage().getItem(StorageConstants.JwtToken);
  }

  clearToken(): void {
    this._getStorage().removeItem(StorageConstants.JwtToken);
  }

  tokenExpires() {
    const expiryTime = new Date(this.getProperty('ExpiryTime'));
    const nowUTC = new Date();
    if (expiryTime <= nowUTC) {
      return true;
    }
    return false;
  }

  getProperty(key: string) {
    const token = this.getToken();
    if (token != null) {
      const value = this.parseJwt(token);
      return value[key];
    }
    return null;
  }

  getProperties() {
    const token = this.getToken();
    if (token != null) {
      return this.parseJwt(token);
    }
    return null;
  }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  shareSessionStorage(value?: 'LOGOUT'): void {
    localStorage.setItem(
      StorageConstants.SessionStorage,
      value ? value : JSON.stringify(this._getToCopyValues())
    );
    localStorage.removeItem(StorageConstants.SessionStorage);
  }

  private _getToCopyValues() {
    const except = ['markedAsPay', 'length'];
    const copy = {};
    for (const key in sessionStorage) {
      if (except.indexOf(key) == -1) {
        copy[key] = sessionStorage[key];
      }
    }
    return copy;
  }

  private _getStorage(): Storage {
    return sessionStorage;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _markIfRolesChanged(token: string) {
    const properties = this.getProperties();
    if (properties['RolesChanged']) {
      this.rolesChanged = true;
    }
  }
}
