import {inject, Injectable} from '@angular/core';
import {catchError, delay, Observable, observeOn, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';

export interface Game {
  board: number[][];
  snakeLength: number;
  isFinished: boolean;
}

export interface SnakeMove {
  direction: number;
}

export interface StartResponse {
  id: string;
  size: number;
}

export interface MoveResponse {

}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:5000/game';

  startGame(): Observable<StartResponse>{
    return this.http.post<StartResponse>(this.apiUrl+"/start", {'size': 15}).pipe(
      catchError(err => {
        console.error('Błąd startowania gry:', err);
        return throwError(() => new Error('Nie udało się wystartować gry.'));
      })
    );
  }

  getBoard(): Observable<Game> {
    return this.http.get<Game>(this.apiUrl+"/state").pipe(
      catchError(err => {
        console.error('Błąd pobierania planszy:', err);
        return throwError(() => new Error('Nie udało się pobrać planszy.'));
      })
    );
  }

  moveSnake(snakeMove: SnakeMove): Observable<MoveResponse> {
    if (snakeMove.direction < 1 || snakeMove.direction > 4) {
      throwError(() => new Error('Direction must be between 1 and 4'));
    }
    return this.http.post<MoveResponse>(this.apiUrl+"/move", snakeMove).pipe(
      catchError(err => {
        console.error('Błąd wysyłania ruchu:', err);
        return throwError(() => new Error('Nie udało się wysłać ruchu.'));
      })
    );
  }
}
