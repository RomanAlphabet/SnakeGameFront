import {inject, Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';

export interface Game {
  board: number[][];
  length: number;
}

export interface SnakeMove {
  direction: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private http = inject(HttpClient);
  private apiUrl = 'https://330dc263-0c0a-4316-94eb-97c352aed749.mock.pstmn.io/game';

  startGame(): void {
    this.http.post(this.apiUrl, {})//dodac moze ip do body?
  }

  getBoard(): Observable<Game> {
    return this.http.get<Game>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Błąd pobierania planszy:', err);
        return throwError(() => new Error('Nie udało się pobrać planszy.'));
      })
    )
  }

  moveSnake(direction : number): void {
    this.http.post(this.apiUrl, {direction: direction})
  }

}
