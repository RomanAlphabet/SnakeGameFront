import {Component, inject, OnInit, signal} from '@angular/core';
import {DatePipe, DecimalPipe, NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Highscore, HighscoresService} from '../../services/highscores.service';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  standalone: true,
  imports: [
    DecimalPipe,
    DatePipe
  ],
  styleUrl: './highscores.component.css'
})
export class HighscoresComponent implements OnInit {
  highscoresService = inject(HighscoresService);
  highScores = signal<Highscore[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.highscoresService.getHighScores().subscribe({
      next: (scores) => {
        this.highScores.set(scores);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Unknown error');
        this.loading.set(false);
      }
    });
  }
}
