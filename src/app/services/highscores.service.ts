import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, delay, Observable, of, throwError} from 'rxjs';

export interface Highscore {
  username: string;
  score: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HighscoresService {
  private http = inject(HttpClient);
  private apiUrl = 'https://330dc263-0c0a-4316-94eb-97c352aed749.mock.pstmn.io/highscores';

  private mockHighscores: Highscore[] = [
    { username: "Gracz1", score: 1500, date: new Date('2024-03-20') },
    { username: "Gracz2", score: 1200, date: new Date('2024-03-19') },
    { username: "Gracz3", score: 900, date: new Date('2024-03-18') },
    { username: "Testowy", score: 2500, date: new Date('2024-03-17') }
  ];

  getHighScores(): Observable<Highscore[]> {
    return this.http.get<Highscore[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Błąd pobierania wyników:', err);
        return throwError(() => new Error('Nie udało się pobrać wyników.'));
      })
    );
    // return of(this.mockHighscores).pipe(
    //   delay(500), // opóźnienie 500ms
    //   catchError(error => {
    //     console.error('Błąd pobierania wyników:', error);
    //     return throwError(() => new Error('Nie udało się pobrać wyników.'));
    //   }))
  }
}
