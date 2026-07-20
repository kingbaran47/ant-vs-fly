import { Component, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../core/services/socket.service';
import { CommonModule } from '@angular/common';
import { Sound } from '../../core/services/sound';

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result implements OnInit, OnDestroy {

    playerName = signal('');
    scores = signal<{[key: string]: number}>({});
    opponent = signal('');

    myPoints = computed(() => this.scores()[this.playerName()] ?? 0);
    oppoPoints = computed(() => this.scores()[this.opponent()] ?? 0);


    winner = computed(() => {
      if (this.myPoints() > this.oppoPoints()) return this.playerName();
      if (this.oppoPoints() > this.myPoints()) return this.opponent();
      return "draw";
    });



    winnerCharacter = computed(() => {
      if (this.myPoints() > this.oppoPoints()) return localStorage.getItem('character') ?? '';
      if (this.oppoPoints() > this.myPoints()) return localStorage.getItem('opponentCharacter') ?? '';
      return 'draw';
    });

    constructor(
    private router: Router,
    private socketService: SocketService,
    private soundService: Sound
  ){}

  ngOnDestroy(): void {
    this.soundService.stopResultLose();
    this.soundService.stopResultWin();
  }

   ngOnInit(): void {

    this.playerName.set(localStorage.getItem('playerName') ?? '');
    this.opponent.set(localStorage.getItem('opponent') ?? '');

    const scoresJson = localStorage.getItem('scores');
    if(scoresJson) {
      this.scores.set(JSON.parse(scoresJson));
    }

    if(this.myPoints() > this.oppoPoints()) {
      this.soundService.playResultWin();
    } else if(this.oppoPoints() > this.myPoints()) {
      this.soundService.playResultLose();
    }

   }



   goToMenu() {
    this.socketService.disconnect();
    this.socketService.reset();
    localStorage.clear();
    this.router.navigate(['/']);
   }


}
