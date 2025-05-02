import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';

export interface Highscore {
  username: string;
  score: number;
  date: string;
}

export interface SendingHighscore {
  username: string;
  score: number;
  date: Date;
  ip: string;
}

export interface IPRequest {
  IPv4: string;
}

@Injectable({
  providedIn: 'root'
})
export class HighscoresService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = 'https://94485659-65bb-4b22-b1eb-b5a344c254a9.mock.pstmn.io/highscores';

  private mockHighscores: Highscore[] = [
    {username: "Gracz1", score: 1500, date: '2024-03-20'},
    {username: "Gracz2", score: 1200, date: '2024-03-19'},
    {username: "Gracz3", score: 900, date: '2024-03-18'},
    {username: "Testowy", score: 2500, date: '2024-03-17'}
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

  setHighScore(highscore: Highscore): void {
    let tempHighscore = {
      username: highscore.username,
      score: highscore.score,
      date: highscore.date,
      ip: this.http.get<IPRequest>('https://geolocation-db.com/json/').pipe(
        catchError(err => {
          console.error('Błąd pobierania wyników:', err);
          return throwError(() => new Error('Nie udało się pobrać wyników.'));
        })
      )
    }
    this.http.post(this.apiUrl, tempHighscore).subscribe({//do przetestowania
        error: (err) => {
          console.error('Błąd wysyłania wyniku:', err);
          return throwError(() => new Error('Nie udało się wysłać wyniku.'));
        },
        next: () => {
          this.router.navigate(['/highscores']).then(r => {
          });
        }
      }
    );
  }
}
