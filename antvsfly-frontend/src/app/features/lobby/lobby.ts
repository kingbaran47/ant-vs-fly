import { Component, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from '../../core/services/socket.service';
import { CommonModule } from '@angular/common';
import { Sound } from '../../core/services/sound';


@Component({
  selector: 'app-lobby',
  imports: [CommonModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css',
})
export class Lobby implements OnInit, OnDestroy {

  
  
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private socketService: SocketService,
    private soundService: Sound
  ){}
  
  private navigatingToGame = false;
  private handleUnload = () => this.socketService.disconnect();
  private subs: Subscription[] = [];

  roomCode = signal('');
  playerName = signal('');
  players= signal<string[]>([]);
  isHost = signal(false);
  errorMessage = signal("");
  hostCharacter = signal("");
  opponent = computed(() =>
  this.players().find(p => p !== this.playerName()) ?? 'Waiting');

  myCharacter = computed(() => {
    if(this.isHost()) {
      return this.hostCharacter();
    }
    return this.hostCharacter() === 'ant' ? 'fly' : 'ant';
  });

  opponentCharacter = computed(() => {
    const myChar = this.myCharacter();
    return myChar === 'ant' ? 'fly' : 'ant';
  })








ngOnDestroy(): void {
  window.removeEventListener('beforeunload', this.handleUnload);
  this.subs.forEach(s => s.unsubscribe());
  if (!this.navigatingToGame) {
    this.socketService.disconnect();
  }
  this.soundService.stopLobby();
}

ngOnInit(): void {
  this.roomCode.set(this.route.snapshot.params['code']);
  this.playerName.set(localStorage.getItem('playerName') ?? '');
  this.isHost.set(localStorage.getItem('isHost') === 'true');

  if(localStorage.getItem('isHost') === 'true') {
    this.hostCharacter.set(localStorage.getItem('character') ?? '');
  }

  this.listenToSocketEvents();
  

  window.addEventListener('beforeunload', this.handleUnload);


}


startTheGame(): void {
  if(this.players().length !== 2) return;
  this.socketService.startGame(this.roomCode());
}

kickPlayer(): void {  
  this.socketService.kickPlayer(this.roomCode(), this.opponent());
  
  
  this.players.set([this.playerName()]);
  
  localStorage.removeItem("opponent")
  localStorage.removeItem("opponentCharacter")
  
  
}

leaveGame(): void {
  const confirmed = confirm("Do you want to leave?");
  if(!confirmed) return;
  this.socketService.disconnect();
  this.socketService.reset();
  localStorage.clear();
  this.router.navigate(['/']);

}






private listenToSocketEvents(): void {

  this.subs.push(
    this.socketService.onKickPlayer().subscribe(data => {
      alert(data.message);
      this.socketService.reset();
      localStorage.clear();
      this.router.navigate(['/']);
    })
  );

  this.subs.push(
    this.socketService.onOpponentLeft().subscribe(data => {
      alert(data.message);
      this.socketService.reset();
      localStorage.clear();
      this.router.navigate(['/']);
    })
  );

  this.subs.push(
    this.socketService.onPlayerJoined().subscribe(data => {
      if(this.isHost()) {
        this.soundService.playSomeoneJoined();
      }

      this.players.set(data.players);
      this.hostCharacter.set(data.hostCharacter);

      const opponent = data.players.find(p => p !== this.playerName());
      if(opponent) localStorage.setItem('opponent', this.opponent());

      if(!this.isHost()){
        const myChar = data.hostCharacter === 'ant' ? 'fly' : 'ant';
        localStorage.setItem('character', myChar);
        localStorage.setItem('opponentCharacter', data.hostCharacter);
      } else {
        localStorage.setItem('character', data.hostCharacter);
        localStorage.setItem('opponentCharacter', data.hostCharacter === 'ant' ? 'fly' : 'ant');
      }
    })
  );

  this.subs.push(
    this.socketService.onGameStart().subscribe(() => {
      this.navigatingToGame = true;
      this.soundService.playButton();
      this.router.navigate(['/game', this.roomCode()]);
    })
  );

  this.subs.push(
    this.socketService.onError().subscribe(data => {
      this.errorMessage.set(data);
    })
  );
}



}
