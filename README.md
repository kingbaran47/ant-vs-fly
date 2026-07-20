# AntVsFly

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat-square&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

A real-time 1v1 quiz battle game. Pick your side — ant or fly — and go head to head against a friend in a race to answer faster and smarter.

---

## How it works

Two players join the same room. Each round, both get the same question at the same time. First to answer correctly pulls ahead. After all rounds, whoever scored more wins.

That's it. No accounts, no setup, no fluff.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Angular 19, Tailwind CSS |
| Backend | Node.js, Express |
| Realtime | Socket.io |
| Questions | [Open Trivia DB](https://opentdb.com) |

---

## Running locally

**Backend**

```bash
cd antvsfly-backend
npm install
npm run dev
```

Make sure `.env` exists:

```
PORT=3000
FRONTEND_URL=http://localhost:4200
```

**Frontend**

```bash
cd antvsfly-frontend
npm install
ng serve
```

Open `http://localhost:4200`.

---

## Game flow

```
Home → Create or join a room → Lobby (wait for opponent) → Quiz → Results
```

One player creates a room and gets a 4-character code. The other enters that code to join. The host starts the game once both are in.

---

## Project structure

```
antvsfly/
├── antvsfly-frontend/     # Angular app
│   └── src/app/
│       ├── features/
│       │   ├── home/      # Landing, create/join room
│       │   ├── lobby/     # Pre-game waiting room
│       │   ├── game/      # Quiz screen
│       │   └── result/    # Winner screen
│       └── core/
│           └── services/  # Socket, Sound
└── antvsfly-backend/      # Express + Socket.io
    └── src/
        ├── server.js      # Socket event handlers
        ├── roomManager.js # In-memory room state
        └── quizService.js # OpenTDB integration
```

---

## Deployment

Set the production backend URL in `antvsfly-frontend/src/environments/environment.production.ts` before building:

```ts
export const environment = {
  production: true,
  backendUrl: 'https://your-backend-url.com'
};
```

Build the frontend:

```bash
ng build --configuration production
```
