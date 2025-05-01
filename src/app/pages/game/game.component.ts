import {Component, inject, signal} from '@angular/core';
import {Game, GameService} from '../../services/game.service';
import {interval, of, subscribeOn, Subscription} from 'rxjs';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './game.component.html',
  standalone: true,
  styleUrl: './game.component.css'
})
export class GameComponent {
  gameService = inject(GameService);
  game = signal<Game>({board: [][1], snakeLength: 1});
  loading = signal(true);
  error = signal<string | null>(null);

  boardSubscription!: Subscription;
  snakeSubscription!: Subscription;
  board: number[][] = [][1];
  direction: number = 1;

  ngOnInit() {
    // this.boardSubscription = interval(100200)
    //   .subscribe(() => {this.getApiBoard()});
    //this.startGame();
    //if request ok then start to nizej
    this.gameService.getBoard().subscribe({
      next: (game) => {
        this.board = game.board;
        this.game.set(game);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Unknown error');
        this.loading.set(false);
      }
    });
    // this.boardSubscription = interval(1000000).subscribe(() => {
    //   this.getApiBoard();
    // });
    // this.snakeSubscription = interval(100000).subscribe(() => {
    //   this.setSnakeMove(this.direction);
    // });
  }

  startGame() {
    this.gameService.startGame();
  }

  getApiBoard() {
    this.gameService.getBoard().subscribe({
      next: (game) => {
        this.board = game.board;
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

  handleKeysDown(event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowUp':
      case 'W':
        this.direction = 1;
        break;
      case 'ArrowRight':
      case 'D':
        this.direction = 2;
        break;
      case 'ArrowDown':
      case 'S':
        this.direction = 3;
        break;
      case 'ArrowLeft':
      case 'A':
        this.direction = 4;
        break;
    }
  }

  protected readonly of = of;
}
