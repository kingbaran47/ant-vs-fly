const rooms = {};

export function createRoom(playerName, socketId, character) {
    const code = generateCode();
    rooms[code] = {
        code,
        players: [{id: socketId, name: playerName}],
        status: "waiting",
        currentQuestionIndex: 0,
        questions: [],
        scores: {[playerName]: 0},
        host: playerName,
        hostCharacter: character
    };
    return rooms[code];
}


export function joinRoom(code, playerName, socketId) {
    const room = rooms[code];
    if(!room) return null; 
    if(room.players.length >= 2) return null;
    room.players.push({id: socketId, name: playerName});
    room.scores[playerName] = 0;
    return room;
}


export function getRoom(code) {
    return rooms[code] || null;
}

export function deleteRoom(code) {
    delete rooms[code];
}

export function getRoomBySocketId(socketId) {
    return Object.values(rooms).find(room => 
       room.players.some(p => p.id === socketId)
    )
}


function generateCode() {
    return Math.random().toString(36).substring(2,6).toUpperCase();
}