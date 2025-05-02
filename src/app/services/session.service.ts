import { Injectable } from '@angular/core';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionIdKey = 'game_session_id';

  get sessionId(): string {
    const id = sessionStorage.getItem(this.sessionIdKey);
    if (!id) {
      return this.generateNewSession();
    }
    return id;
  }

  private generateNewSession(): string {
    const newId = v4();
    sessionStorage.setItem(this.sessionIdKey, newId);
    return newId;
  }

  clearSession(): void {
    sessionStorage.removeItem(this.sessionIdKey);
  }
}
