import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, ReplaySubject } from 'rxjs';
import { Question } from '../../models/question.model';
import { AnswerResult } from '../../models/answer-result.model';
import { PlayerJoined } from '../../models/player-joined.model';
import { environment } from '../../../environments/environment';







@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;

    // ReplaySubject caches the last emitted event -> to prevent Race Conditions
    private playerJoined$ = new ReplaySubject<PlayerJoined>(1);
    private gameStart$ = new ReplaySubject<{questions: Question[]}>(1);


    constructor() {
        this.socket = io(environment.backendUrl);

        // Register events centrally so ReplaySubject can cache them
        this.socket.on('player-joined', (data) => {
            this.playerJoined$.next(data);
        });

        this.socket.on('game-start', (data) => {
            this.gameStart$.next(data);
        });

    }


    disconnect() {
        this.socket.disconnect();
    }

    reset() {
        this.playerJoined$ = new ReplaySubject<PlayerJoined>(1);
        this.gameStart$ = new ReplaySubject<{questions: Question[]}>(1);
    }

    reconnect() {
        if (!this.socket.connected) {
            this.socket.connect();
        }
    }


    kickPlayer(roomCode: string, userName: string) {
        this.socket.emit('user-disconnect', roomCode, userName);
    }

    onKickPlayer(): Observable<{message: string}> {
        return new Observable(observer => {
            const handler = (data: {message: string}) => observer.next(data);
            this.socket.on('kicked-by-host', handler);
            return () => this.socket.off('kicked-by-host', handler);
        })
    }


    createRoom(playerName: string, character: string) {
        this.socket.emit("create-room", {playerName, character})
    }


    joinRoom(code: string, playerName: string) {
        this.socket.emit('join-room', {code, playerName});
    }

    startGame(code: string) {
        this.socket.emit('start-game-please', {code});
    }



    submitSelection(code: string, playerName: string, selectedAnswer: string) {
        this.socket.emit('answer-selected', {code, playerName, selectedAnswer})
    }



    onPlayerSelected(): Observable<{playerName: string, selectedAnswer: string}> {
        return new Observable(observer => {
            const handler = (data: {playerName: string, selectedAnswer: string}) => observer.next(data);
            this.socket.on('selected-this', handler);
            return () => this.socket.off('selected-this', handler);
        })
    }






    onRoomCreated(): Observable<{code: string}> {
        return new Observable(observer => {
            const handler = (data: {code: string}) => observer.next(data);
            this.socket.on('room-created', handler);
            return () => this.socket.off('room-created', handler);
        })
    }

    
    onPlayerJoined(): Observable<PlayerJoined> {
        return this.playerJoined$.asObservable();
    }
//
    onGameStart(): Observable<{questions: Question[]}> {
        return this.gameStart$.asObservable();
    }

    onAnswerResult(): Observable<AnswerResult> {
        return new Observable(observer => {
            const handler = (data: AnswerResult) => observer.next(data);
            this.socket.on('answer-result', handler);
            return () => this.socket.off('answer-result', handler);
        })
    }

    onOpponentLeft(): Observable<{message: string}> {
        return new Observable(observer => {
            const handler = (data: {message: string}) => observer.next(data);
            this.socket.on('opponent-left', handler);
            return () => this.socket.off('opponent-left', handler);
        })
    }


    onError(): Observable<string> {
        return new Observable(observer => {
            const handler = (data: string) => observer.next(data);
            this.socket.on('error', handler);
            return () => this.socket.off('error', handler);
        })
    }



}