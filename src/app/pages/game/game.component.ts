import {Component, HostListener, inject, signal} from '@angular/core';
import {Game, GameService} from '../../services/game.service';
import {delay, Subscription} from 'rxjs';
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
  game = signal<Game>({board: [][1], snakeLength: 1, isFinished: true});
  loading = signal(false);
  error = signal<string | null>(null);

  private boardSubscription!: Subscription;
  private snakeSubscription!: Subscription;
  direction: number = 1;
  usernameInput: string = "";

  ngOnInit() {
    // this.boardSubscription = interval(100200)
    //   .subscribe(() => {this.getApiBoard()});
    //this.startGame();
    //if request ok then start to nizej
    // this.gameService.getBoard().subscribe({//mock one get
    //   next: (game) => {
    //     this.game.set(game);
    //     this.loading.set(false);
    //   },
    //   error: (err) => {
    //     this.error.set(err.message || 'Unknown error');
    //     this.loading.set(false);
    //   }
    // });
    // this.boardSubscription = interval(300).subscribe(() => {
    //   this.getApiBoard();
    // });
    // this.snakeSubscription = interval(150).subscribe(() => {
    //   console.log(this.direction)
    //   // this.setSnakeMove(this.direction);
    // });
  }

  startGame() {
    this.gameService.startGame();
  }

  getApiBoard() {
    this.gameService.getBoard().subscribe({
      next: (game) => {
        this.game.set(game);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Unknown error');
        this.loading.set(false);
      }
    });
  }

  setSnakeMove(direction: number) {
    this.gameService.moveSnake({direction: direction});
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
      score: this.game().snakeLength,
      date: formatDate(dateTimestampProvider.now(), "dd-MM-yyyy", "en-GB")
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeysDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
        console.log(1);
        this.direction = 1;
        break;
      case 'ArrowRight':
      case 'd':
        console.log(2);
        this.direction = 2;
        break;
      case 'ArrowDown':
      case 's':
        console.log(3);
        this.direction = 3;
        break;
      case 'ArrowLeft':
      case 'a':
        console.log(4);
        this.direction = 4;
        break;
    }
  }
}
