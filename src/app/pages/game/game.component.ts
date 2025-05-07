import {Component, HostListener, inject, signal} from '@angular/core';
import {Game, GameService} from '../../services/game.service';
import {delay, interval, Subscription} from 'rxjs';
import {formatDate, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HighscoresService} from '../../services/highscores.service';
import {dateTimestampProvider} from 'rxjs/internal/scheduler/dateTimestampProvider';

@Component({
  selector: 'app-game',
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './game.component.html',
  standalone: true,
  styleUrl: './game.component.css'
})
export class GameComponent {
  private gameService = inject(GameService);
  private highscoresService = inject(HighscoresService);
  game = signal<Game>({board: [][1], snakeLength: 2, isFinished: false});
  loading = signal(true);
  error = signal<string | null>(null);

  speed = signal<number>(600);

  private boardSubscription!: Subscription;
  private snakeSubscription!: Subscription;
  direction: number = 1;
  usernameInput: string = "";


  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.gameService.startGame().subscribe({
      next: (value) => {
        this.boardSubscription = interval(100).subscribe(() => {
          this.getApiBoard();
          this.speed.set(600 / (Math.pow(2, this.game().snakeLength - 2)));
        });
        this.snakeSubscription = interval(this.speed())
          .subscribe(() => {
            //console.log(this.direction)
            this.setSnakeMove(this.direction);
          });
      },
      error: (err) => {
        this.error.set(err.message || 'Unknown error');
        this.loading.set(false);
      }
    });
  }

  getApiBoard() {
    this.gameService.getBoard().subscribe({
      next: (game) => {
        this.game.set(game);
        this.loading.set(false);
        if (game.isFinished) {
          console.log(game.snakeLength)
          this.snakeSubscription?.unsubscribe();
          this.boardSubscription?.unsubscribe();
        }
      },
      error: (err) => {
        this.error.set(err.message || 'Unknown error');
        this.loading.set(false);
      }
    });
  }

  setSnakeMove(direction: number) {
    this.gameService.moveSnake({'direction': direction}).subscribe();
  }

  ngOnDestroy() {
    this.boardSubscription?.unsubscribe();
    this.snakeSubscription?.unsubscribe();
  }

  handleSaveScoreButtonClicked() {
    delay(200);
    alert("Your score has been saved!");
    this.highscoresService.setHighScore({
      username: this.usernameInput,
      score: this.game().snakeLength
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeysDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
        this.direction = 1;
        break;
      case 'ArrowRight':
      case 'd':
        this.direction = 4;
        break;
      case 'ArrowDown':
      case 's':
        this.direction = 3;
        break;
      case 'ArrowLeft':
      case 'a':
        this.direction = 2;
        break;
    }
  }
}
