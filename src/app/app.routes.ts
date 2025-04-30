import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {HighscoresComponent} from './pages/highscores/highscores.component';
import {AboutComponent} from './pages/about/about.component';
import {GameComponent} from './pages/game/game.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent},
  { path: 'highscores', component: HighscoresComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
