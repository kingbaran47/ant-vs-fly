import { Routes } from '@angular/router';
import { Home } from './features/home/home'


export const routes: Routes = [
    {path: '', component: Home},
    {path: 'lobby/:code', loadComponent: () => import('./features/lobby/lobby').then(m => m.Lobby)},
    {path: 'game/:code', loadComponent: () => import('./features/game/game').then(m => m.Game)},
    {path: 'result/:code', loadComponent: () => import('./features/result/result').then(m => m.Result)}



];
