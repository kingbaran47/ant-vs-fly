export interface Player {
    id: string, 
    name: string;
}

export interface Room {
    code: string,
    players: Player[],
    status: 'waiting' | 'playing' | 'finished';
    scores: {[playerName: string]: number};
}