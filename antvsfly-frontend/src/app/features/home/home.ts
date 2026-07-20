import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SocketService } from '../../core/services/socket.service';
import { Sound } from '../../core/services/sound';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  playerName: string = "";
  roomCode: string = "";
  selectedCharacter: string = "";
  private roomCreatedSub?: Subscription;

  selectCharacter(character: string) {
    this.selectedCharacter  = character;
    this.soundService.playButton();

    if(character === 'ant') {
      this.soundService.playAntSelect();
    }

    if(character === 'fly') {
      this.soundService.playFlySelect();
    }


  }

  constructor(
    private socketService: SocketService,
    private router: Router,
    private soundService: Sound
  ) {}

  ngOnInit(): void {
    const unlock = () => {
      this.soundService.playBackground();
      document.removeEventListener('click', unlock);
    };
    document.addEventListener('click', unlock);
  }

  ngOnDestroy(): void {
    this.roomCreatedSub?.unsubscribe();
  }

  createRoom() {

    if(!this.playerName) return;
    if(!this.selectedCharacter) return;
    this.socketService.reconnect();
    localStorage.setItem('playerName', this.playerName);
    this.socketService.createRoom(this.playerName, this.selectedCharacter);
    localStorage.setItem('character', this.selectedCharacter)
    localStorage.setItem('isHost', 'true');

    this.roomCreatedSub?.unsubscribe();
    this.roomCreatedSub = this.socketService.onRoomCreated().subscribe(data => {
      this.soundService.stopBackground();
      this.soundService.playJoinLobby();
      this.router.navigate(['/lobby', data.code]);
    });

  }



  joinRoom() {

    if(!this.playerName || !this.roomCode) return;
    this.socketService.reconnect();
    localStorage.setItem('playerName', this.playerName);
    localStorage.setItem('isHost', 'false');
    this.socketService.joinRoom(this.roomCode, this.playerName);
    this.soundService.stopBackground();
    this.soundService.playJoinLobby();
    this.router.navigate(['/lobby', this.roomCode]);
  }



}
