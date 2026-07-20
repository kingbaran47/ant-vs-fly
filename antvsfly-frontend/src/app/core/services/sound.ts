import { Injectable } from '@angular/core';
import { Howl, Howler } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class Sound {

  private background = new Howl({
    src: ['sounds/homeMusic.mp3'],
    volume: 0.2,
    loop: true
  });

  private resultWin = new Howl({
    src: ['sounds/resultWin.mp3'],
    volume: 0.8,
    loop: true
  });

   private button = new Howl({
    src: ['sounds/button.wav'],
    volume: 0.2,
    loop: false
  });

     private resultLose = new Howl({
    src: ['sounds/resultLose.mp3'],
    volume: 0.8,
    loop: false
  });

    private quizMusic = new Howl({
    src: ['sounds/quizMusic.mp3'],
    volume: 0.4,
    loop: true
  });


  private joinlobby = new Howl({
    src: ['sounds/lobbyMusic.mp3'],
    volume: 0.4,
    loop: false
  });

    private antSelect = new Howl({
    src: ['sounds/antSelect.wav'],
    volume: 0.8,
    loop: false
  });

     private flySelect = new Howl({
    src: ['sounds/flySelect.wav'],
    volume: 0.8,
    loop: false
  });

 

    private someonejoined = new Howl({
    src: ['sounds/someonejoined.wav'],
    volume: 0.4,
    loop: false
  });

   private answerselect = new Howl({
    src: ['sounds/answer.wav'],
    volume: 0.4,
    loop: false
  });

  private correct = new Howl({
    src: ['sounds/correct.wav'],
    volume: 0.4,
    loop: false
  });

  private wrong = new Howl({
    src: ['sounds/wrong.wav'],
    volume: 0.4,
    loop: false
  });

  playResultWin() {
    this.resultWin.play();
  };

  stopResultWin() {
    this.resultWin.stop();
  }


  playResultLose() {
    this.resultLose.play();
  };

  stopResultLose() {
    this.resultLose.stop();
  }

  playFlySelect() {
    this.flySelect.play();
  }

  playAntSelect() {
    this.antSelect.play();
  }

  playCorrect() {
    this.correct.play();
  }

  playWrong() {
    this.wrong.play();
  }

  playAnswer() {
    this.answerselect.play();
  }

  playBackground() {
    this.background.play();
  }

  stopBackground() {
    this.background.stop();
  }

  playQuiz() {
    this.quizMusic.play();
  }

   stopQuiz() {
    this.quizMusic.stop();
  }

  playButton() {
    this.button.play();
  }

  playJoinLobby() {
    this.joinlobby.play()
  }

  playSomeoneJoined() {
    this.someonejoined.play()
  }

  stopAll() {
    Howler.stop();
  }

  stopLobby() {
    this.joinlobby.stop();
  }

}
