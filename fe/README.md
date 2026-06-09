# Poker Results Tracker

A web application designed to simplify tracking buy-ins, cash flow, and results during poker games.

## Project Overview

Poker Results Tracker solves a common problem in casual poker games: tracking money when players join and leave throughout a session. The application allows users to:

- Create a poker room and become the host
- Add players to the room
- Track buy-ins and chip purchases during the game
- Close the room at the end of the session by recording final chip counts
- Automatically calculate and display each player's profit or loss

This eliminates the need for manual calculations and provides a clear record of all transactions, ensuring transparency among players.

## How It Works

1. **Room Creation**: A user creates a "room" for a poker session and becomes the host.
2. **Player Management**: The host adds other players to the room.
3. **Buy-in Tracking**: Players can buy chips during the game, with all transactions recorded.
4. **Game Closure**: When the session ends, the host closes the room and inputs each player's final chip count.
5. **Results Calculation**: The system calculates each player's profit or loss automatically.
6. **Transparency**: All players can see the final results showing exactly how much each person won or lost.

## Technical Details

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

## Local .env Setup

```sh
cp .env.example .env
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
