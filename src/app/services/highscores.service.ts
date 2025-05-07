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
  private apiUrl = 'http://127.0.0.1:5000/highscores';

  getHighScores(): Observable<Highscore[]> {
    return this.http.get<Highscore[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Błąd pobierania wyników:', err);
        return throwError(() => new Error('Nie udało się pobrać wyników.'));
      })
    );
  }

  setHighScore(highscore: { score: number; username: string }): void {
    let tempIp;
      this.http.get<IPRequest>('https://geolocation-db.com/json/').subscribe({
      next: (ip) => {
        tempIp = ip.IPv4;
      },
      error: (err) => {
        catchError(err => {
          console.error('Błąd pobierania ip:', err);
          return throwError(() => new Error('Nie udało się pobrać ip.'));
        })
      }
    })

    let tempHighscore = {
      username: highscore.username,
      score: highscore.score,
      ip: tempIp
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
