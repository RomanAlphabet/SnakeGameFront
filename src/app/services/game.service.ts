import {inject, Injectable} from '@angular/core';
import {catchError, delay, Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';

export interface Game {
  board: number[][];
  snakeLength: number;
  isFinished: boolean;
}

export interface SnakeMove {
  direction: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private http = inject(HttpClient);
  private apiUrl = 'https://94485659-65bb-4b22-b1eb-b5a344c254a9.mock.pstmn.io/game';

  startGame(): void {
    this.http.post(this.apiUrl, {}).pipe(
      delay(200),
      catchError(err => {
        console.error('Błąd startowania gry:', err);
        return throwError(() => new Error('Nie udało się wystartować gry.'));
      })
    );
  }

  getBoard(): Observable<Game> {
    return this.http.get<Game>(this.apiUrl).pipe(//credidenciale naprawic
      catchError(err => {
        console.error('Błąd pobierania planszy:', err);
        return throwError(() => new Error('Nie udało się pobrać planszy.'));
      })
    );
  }

  moveSnake(snakeMove: SnakeMove): void {
    if (snakeMove.direction < 1 || snakeMove.direction > 4) {
      throwError(() => new Error('Direction must be between 1 and 4'));
    }
    this.http.post(this.apiUrl, snakeMove, {withCredentials: true}).pipe(
      delay(200),
      catchError(err => {
        console.error('Błąd wysyłania ruchu:', err);
        return throwError(() => new Error('Nie udało się wysłać ruchu.'));
      })
    );
  }

}
