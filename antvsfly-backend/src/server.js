import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createRoom, joinRoom, getRoom, deleteRoom, getRoomBySocketId } from "./roomManager.js";
import { fetchQuestions } from "./quizService.js";
import 'dotenv/config'


const app = express();
const server = createServer(app); 

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    methods: ["GET", "POST"]
})); 

app.use(express.json());

app.get("/", (req, res) => {
    res.json({status: "Ant vs Fly is running"});
});

io.on("connection", (socket) => {
    console.log("Spieler connected", socket.id);

    socket.on("create-room", ({playerName, character}) => {

        const room = createRoom(playerName, socket.id, character);
        socket.join(room.code);
        socket.emit("room-created", {code: room.code});
        
        

        
        
        console.log(`Room ${room.code} was created successfully by Player ${playerName}`);

    });



    socket.on("start-game-please", async ({code}) => {
        const room = getRoom(code);
        if(!room) return;
        const questions = await fetchQuestions(3);
        room.questions = questions;
        room.status = 'playing';
        const questionsForFrontend = questions.map(q => ({
            text: q.text,
            answers: q.answers
        }));

        io.to(code).emit("game-start", {
            questions: questionsForFrontend
        })
        


    });




    socket.on("join-room", async ({code, playerName}) => {
        const room = joinRoom(code, playerName, socket.id);

        if(!room) {
            socket.emit("error", "Room does not exist");
            return;
        }

        socket.join(code);

        io.to(code).emit("player-joined", {
            players: room.players.map(p => p.name),
            host: room.host,
            hostCharacter: room.hostCharacter
        })
    });


    // All players have to answer before answers get evaluated
    socket.on("answer-selected", ({code, playerName, selectedAnswer}) => {
        const room = getRoom(code);
        if(!room) return;

        if(!room.answers) room.answers = {};
        room.answers[playerName] = selectedAnswer;

        // Let both players know which answer was selected
        io.to(code).emit("selected-this", {
            playerName,
            selectedAnswer
        })

        // Only evalute answers when both players have answered
        if(Object.keys(room.answers).length === 2) {
            const correctAnswer = room.questions[room.currentQuestionIndex].correctAnswer;

            Object.entries(room.answers).forEach(([name, answer]) => {
                if(answer === correctAnswer) {
                    room.scores[name] += 1;
                }
            });

            io.to(code).emit("answer-result", {
                correctAnswer,
                scores: room.scores,
                answers: room.answers
            });

            room.answers = {};
            room.currentQuestionIndex += 1;
        }
    })






    
    socket.on("disconnect", () => {
        const room = getRoomBySocketId(socket.id);
        if(!room) return;
        io.to(room.code).emit("opponent-left", {
            message: "Someone left the game!"
        });

        deleteRoom(room.code);

    });


    // Host kicks player - player who gets kicked gets notification first
    // leave() insted of disconnect() so the host stays unaffected
    // The kicked players gets navigated to menu after receiving 'kicked-by-host' event
    socket.on("user-disconnect", (roomCode, userName) => {
        const room = getRoom(roomCode);
        if(!room) return;

        const kicked = room.players.find(p => p.name === userName);
        if(!kicked) return;

        io.to(kicked.id).emit("kicked-by-host", {
            message: "You were kicked by the host."
        });

        room.players = room.players.filter(p => p.name !== userName);
        delete room.scores[userName];

        const kickedSocket = io.sockets.sockets.get(kicked.id);
        if(kickedSocket) kickedSocket.leave(roomCode);
    });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});



