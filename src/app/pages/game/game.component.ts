import {Component, HostListener, inject, signal} from '@angular/core';
import {Game, GameService} from '../../services/game.service';
import {BehaviorSubject, delay, interval, Subscription, switchMap, tap} from 'rxjs';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HighscoresService} from '../../services/highscores.service';

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

  isGameStarted = signal<boolean>(false);

  private boardSubscription!: Subscription;
  private snakeSubscription!: Subscription;

  private snakeSpeed$ = new BehaviorSubject<number>(600);
  private boardRefreshSpeed$ = new BehaviorSubject<number>(200);

  direction: number = 1;
  sizeInput: number = 15;
  usernameInput: string = "";

  ngOnInit() {
    //this.startGame();
  }

  startGame(size: number) {
    this.isGameStarted.set(true);
    this.gameService.startGame(size).subscribe({
      next: () => {
        this.snakeSubscription = this.snakeSpeed$.pipe(
          switchMap(speed => interval(speed)),
          tap(() => this.gameService.moveSnake({direction: this.direction}).subscribe())
        ).subscribe();

        this.boardSubscription = this.boardRefreshSpeed$.pipe(
          switchMap(speed => interval(speed)),
          tap(() => this.getApiBoard())
        ).subscribe();
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
        if (this.game().snakeLength < game.snakeLength) {
          this.updateSnakeSpeed(this.snakeSpeed$.value / 1.07);
          if (game.snakeLength == 5) {
            this.updateBoardRefreshSpeed(150);
          } else if (game.snakeLength == 8) {
            this.updateBoardRefreshSpeed(100);
          }
        }
        this.game.set(game);
        this.loading.set(false);
        if (game.isFinished) {
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

  ngOnDestroy() {
    this.boardSubscription?.unsubscribe();
    this.snakeSubscription?.unsubscribe();
  }

  updateSnakeSpeed(newSpeed: number) {
    this.snakeSpeed$.next(newSpeed);
  }

  updateBoardRefreshSpeed(newSpeed: number) {
    this.boardRefreshSpeed$.next(newSpeed);
  }

  validateSizeInput(value: number) {
    if (value < 5) this.sizeInput = 5;
    if (value > 25) this.sizeInput = 25;
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
