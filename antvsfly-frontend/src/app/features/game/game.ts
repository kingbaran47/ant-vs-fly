import { Component, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from '../../core/services/socket.service';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/question.model';
import { Sound } from '../../core/services/sound';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.html',
  styleUrl: './game.css',
})




export class Game implements OnInit, OnDestroy {

  private navigatingToResult = false;
  private handleUnload = () => this.socketService.disconnect();
  private subs: Subscription[] = [];

  playerName = signal('');
  roomCode = signal('');
  questions = signal<Question[]>([]);
  currentQuestionIndex = signal(0);
  scores = signal<{[key: string]: number}>({});
  selectedAnswer = signal('');
  showResult = signal(false);
  currentQuestion = computed(() => {
    return this.questions()[this.currentQuestionIndex()];
  });
  opponent = signal('');
  countdown = signal(5);


  opponentCharacter = signal('');
  character = signal('');

  mySelection = signal("");
  oppoSelection = signal("");
  correctAnswer = signal("");

  isCorrect = signal(false);
  opponentIsCorrect = signal(false);




  myPoints = computed(() => 
  this.scores()[this.playerName()] ?? 0);
  
  oppoPoints = computed(() => 
  this.scores()[this.opponent()] ?? 0); 

  
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private socketService: SocketService,
    private soundService: Sound
  ){}

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.handleUnload);
    this.subs.forEach(s => s.unsubscribe());
    if (!this.navigatingToResult) {
      this.socketService.disconnect();
    }
    this.soundService.stopQuiz();
  }

  ngOnInit(): void {
    this.playerName.set(localStorage.getItem('playerName') ?? '');
    this.roomCode.set(this.route.snapshot.params['code']);
    this.opponent.set(localStorage.getItem('opponent') ?? '');
    this.listenToSocketEvents();

    this.character.set(localStorage.getItem('character') ?? '');
    this.opponentCharacter.set(localStorage.getItem('opponentCharacter') ?? '');

    window.addEventListener('beforeunload', this.handleUnload);

    
  }

  submitAnswer(answer: string) {
    this.selectedAnswer.set(answer);
    this.soundService.playAnswer();
    this.socketService.submitSelection(this.roomCode(), this.playerName(), answer);

  }




  private startCountdown(): void {
    const interval = setInterval(() => {
      this.countdown.update(c => c - 1);
      if(this.countdown() === 0) {
        this.soundService.playQuiz();
        clearInterval(interval);
      }

    }, 1000);
  }

  private listenToSocketEvents(): void {

    this.subs.push(
      this.socketService.onOpponentLeft().subscribe(data => {
        alert(data.message);
        this.socketService.reset();
        localStorage.clear();
        this.router.navigate(['/']);
      })
    );

    this.subs.push(
      this.socketService.onGameStart().subscribe(data => {
        this.questions.set(data.questions);
        this.startCountdown();
      })
    );

    this.subs.push(
      this.socketService.onPlayerSelected().subscribe(data => {
        if(data.playerName === this.playerName()) {
          this.mySelection.set(data.selectedAnswer);
        } else {
          this.oppoSelection.set(data.selectedAnswer);
        }
      })
    );

    this.subs.push(this.socketService.onAnswerResult().subscribe(data => {
     

      setTimeout(() => {
      
      const myAnswer = data.answers[this.playerName()];
      const opponentAnswer = data.answers[this.opponent()];
      this.isCorrect.set(myAnswer === data.correctAnswer);
      this.opponentIsCorrect.set(opponentAnswer === data.correctAnswer);
      this.soundService.stopQuiz();
      if(this.isCorrect()) {
        this.soundService.playCorrect();
      }
      if(!this.isCorrect()) {
        this.soundService.playWrong();
      }

      this.scores.set(data.scores);
      this.correctAnswer.set(data.correctAnswer);
      this.showResult.set(true);

          setTimeout(() => {

            this.showResult.set(false);
            this.correctAnswer.set("");
            this.isCorrect.set(false);
            this.opponentIsCorrect.set(false);

            const nextIndex = this.currentQuestionIndex() + 1;
            if(nextIndex >= this.questions().length) {
              localStorage.setItem('scores', JSON.stringify(data.scores));
              this.navigatingToResult = true;
              this.soundService.stopQuiz();
              this.router.navigate(['/result', this.roomCode()]);
              return;
            }
            this.currentQuestionIndex.set(nextIndex);
            this.selectedAnswer.set('');
            this.mySelection.set('');
            this.oppoSelection.set('');
            this.soundService.playQuiz();

          }, 4000);
     
     

    }, 3000);

  }));
  }
    

      






}
