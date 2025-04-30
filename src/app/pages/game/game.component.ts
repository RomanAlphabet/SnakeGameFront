import {Component, inject, signal} from '@angular/core';
import {Game, GameService} from '../../services/game.service';
import {interval, Subscription, switchAll} from 'rxjs';
import {DatePipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';

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
  game = signal<Game>({board: [][1], length: 1});
  loading = signal(true);
  error = signal<string | null>(null);

  boardSubscription! : Subscription;
  snakeSubscription! : Subscription;
  board: any;

  ngOnInit() {
    // this.boardSubscription = interval(100200)
    //   .subscribe(() => {this.getApiBoard()});
    this.boardSubscription = interval(10000000).subscribe(() => {this.getApiBoard()})
    this.snakeSubscription = interval(1000)
      .subscribe(() => {this.getApiBoard()});
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

  setSnakeMove(direction : number) {
    this.gameService.moveSnake(direction);
  }

  ngOnDestroy() {
    this.boardSubscription?.unsubscribe();
    this.snakeSubscription?.unsubscribe();
  }

}
