let gameStarted = false;
let currentRow = 1,
  currentCol = 1;
let startGameButton = <HTMLButtonElement>document.querySelector("#startGame");
let hit1 = <HTMLButtonElement>document.querySelector("#hit1");
let hit2 = <HTMLButtonElement>document.querySelector("#hit2");
let finalResultDiv = <HTMLDivElement>document.querySelector("#finalResult");
let team1Score = 0,
  team2Score = 0;
let team1Player = 0,
  team2Player = 0;

let boardRow1 = {
  0: "TEAM ",
  1: "B1",
  2: "B2",
  3: "B3",
  4: "B4",
  5: "B5",
  6: "B6",
  7: "TOTAL",
};

let createDiv = (className: string) => {
  let element = document.createElement("div");
  element.className = className;
  return element;
};

let createBoardDiv = (row: number, col: number, teamName: string) => {
  let element;
  if (col === 0 || col === 7) {
    element = createDiv("col-3");
  } else {
    element = createDiv("col-1");
  }
  element.setAttribute("row", row.toString());
  element.setAttribute("col", col.toString());
  element.setAttribute("teamName", teamName.split(" ").join(""));
  if (row === 0 && col === 0) {
    element.innerHTML = teamName;
  } else if (row === 0) {
    element.innerHTML = boardRow1[col];
  } else if (col === 0) {
    element.innerHTML = `Player ${row}`;
  }
  return element;
};

class Game {
  teams: Array<Team> = new Array();
  currentPlayingTeam: Team;

  constructor() {
    startGameButton.setAttribute("disabled", "true");
    (currentRow = 1), (currentCol = 1);
    this.teams.push(new Team("TEAM 1"));
    this.teams.push(new Team("TEAM 2"));
    this.displayTeam(this.teams[0].name, "TEAM1");
    this.displayTeam(this.teams[1].name, "TEAM2");
    this.startTimer();
  }

  displayTeam(teamName: string, id: string) {
    let displayElement = <HTMLDivElement>document.querySelector(`#${id}`);
    displayElement.innerHTML = "";
    for (let i = 0; i < 11; i++) {
      let row = createDiv("row");
      for (let j = 0; j < 8; j++) {
        var div = createBoardDiv(i, j, teamName);
        row.append(div);
      }
      displayElement.append(row);
    }
  }

  startTimer() {
    let timer = <HTMLDivElement>document.querySelector("#timer");
    let generate = <HTMLButtonElement>document.querySelector("#generate");
    generate.setAttribute("disabled", "true");
    hit2.setAttribute("disabled", "true");
    this.currentPlayingTeam = this.teams[0];
    let time = 1;

    let interval = setInterval(() => {
      timer.innerHTML = (time++).toString();
      if (time === 31) {
        (currentRow = 1), (currentCol = 1);
        hit1.setAttribute("disabled", "true");
        hit2.removeAttribute("disabled");
        this.currentPlayingTeam = this.teams[1];
      } else if (time === 61) {
        hit1.setAttribute("disabled", "true");
        hit2.setAttribute("disabled", "true");
        generate.removeAttribute("disabled");
        gameStarted = false;
        this.currentPlayingTeam = null;
        clearInterval(interval);
      }
    }, 1000);
  }
}

class Team {
  name: string;
  players: Array<Player> = new Array(10);
  teamScore: number = 0;

  constructor(name: string) {
    this.name = name;
    for (let i = 1; i < 11; i++) {
      let currentPlayer = new Player(`Player ${i}`);
      this.players[i - 1] = currentPlayer;
    }
  }
}

class Player {
  name: string;
  score: number;

  constructor(name: string) {
    this.name = name;
  }
}

let score1 = 0,
  score2 = 0;
let game;
let totalScore;
let updateScore = (score: number, id: string) => {
  let divId = id === "TEAM 1" ? "score1" : "score2";
  let updateDiv = <HTMLDivElement>document.querySelector(`#${divId}`);
  let currentScore = parseInt(updateDiv.innerHTML);
  updateDiv.innerHTML = (currentScore + score).toString();
};

let updatePlayerScore = (score: number, row: number, name: string) => {
  let updateDiv = <HTMLDivElement>(
    document.querySelector(`[teamname="${name}"][row="${currentRow}"][col="7"]`)
  );
  let currentScore = updateDiv.innerHTML;
  if (!currentScore) {
    totalScore = score;
  } else {
    totalScore += score;
  }
  if (name === "TEAM1") {
    if (team1Score < totalScore) {
      team1Score = Math.max(team1Score, totalScore);
      team1Player = row;
    }
  } else {
    if (team2Score < totalScore) {
      team2Score = Math.max(team2Score, totalScore);
      team2Player = row;
    }
  }

  updateDiv.innerHTML = totalScore.toString();
};

let handleBatting = (team: Team) => {
  let name = team.name.split(" ").join("");
  let currentBox = <HTMLDivElement>(
    document.querySelector(
      `[teamname="${name}"][row="${currentRow}"][col="${currentCol}"]`
    )
  );
  let run = Math.floor(Math.random() * 7);
  if (currentRow <= 10) {
    updateScore(run, team.name);
    updatePlayerScore(run, currentRow, name);
    currentBox.innerHTML = run.toString();
    if (run === 0) {
      currentRow++;
      currentCol = 1;
    } else {
      if (currentCol === 6) {
        currentRow++;
        currentCol = 1;
      } else {
        currentCol++;
      }
    }
  }
};

(<HTMLButtonElement>document.querySelector("#startGame")).addEventListener(
  "click",
  () => {
    let score1div = <HTMLDivElement>document.querySelector("#score1");
    let score2div = <HTMLDivElement>document.querySelector("#score2");
    score1div.innerHTML = "";
    score2div.innerHTML = "";
    score1div.innerHTML = "0";
    score2div.innerHTML = "0";

    if (!gameStarted) {
      game = new Game();
      (currentRow = 1), (currentCol = 1);
      let hit1 = document.querySelector("#hit1");
      let hit2 = document.querySelector("#hit2");
      generateButton.setAttribute("disabled", "true");
      finalResultDiv.innerHTML = "";
      hit1.removeAttribute("disabled");
      hit1.addEventListener("click", () => {
        handleBatting(game.currentPlayingTeam);
      });
      hit2.addEventListener("click", () => {
        handleBatting(game.currentPlayingTeam);
      });
    }
  }
);

let generateButton = <HTMLButtonElement>document.querySelector("#generate");
generateButton.addEventListener("click", () => {
  let row1 = createDiv("row");
  let row2 = createDiv("col-12 bold");
  let row3 = createDiv("col-12");
  let row4 = createDiv("col-12 bold");
  let row5 = createDiv("col-12 bold");
  let row6 = createDiv("col-12 bold");
  row3.innerHTML = "MAN OF THE MATCH";
  let score1 = parseInt(
    (<HTMLDivElement>document.querySelector("#score1")).innerHTML
  );
  let score2 = parseInt(
    (<HTMLDivElement>document.querySelector("#score2")).innerHTML
  );
  if (score1 > score2) {
    row2.innerHTML = "MATCH WON BY TEAM 1";

    row4.innerHTML = `PLAYER ${team1Player}`;
    row5.innerHTML = "TEAM 1";
    row6.innerHTML = `SCORE ${team1Score}`;
  } else {
    row2.innerHTML = "MATCH WON BY TEAM 2";
    row4.innerHTML = `PLAYER ${team2Player}`;
    row5.innerHTML = "TEAM 2";
    row6.innerHTML = `SCORE ${team2Score}`;
  }
  row1.append(row2, row3, row4, row5, row6);
  finalResultDiv.append(row1);
  startGameButton.removeAttribute("disabled");
  (team1Score = 0), (team2Score = 0);
});
