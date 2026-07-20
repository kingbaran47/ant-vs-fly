export interface AnswerResult {
    correctAnswer: string;
    scores: {[playerName: string]: number};
    answers: {[playerName: string]: string};
}