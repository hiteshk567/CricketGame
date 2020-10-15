var gameStarted = false;
var currentRow = 1, currentCol = 1;
var startGameButton = document.querySelector("#startGame");
var hit1 = document.querySelector("#hit1");
var hit2 = document.querySelector("#hit2");
var finalResultDiv = document.querySelector("#finalResult");
var team1Score = 0, team2Score = 0;
var team1Player = 0, team2Player = 0;
var boardRow1 = {
    0: "TEAM ",
    1: "B1",
    2: "B2",
    3: "B3",
    4: "B4",
    5: "B5",
    6: "B6",
    7: "TOTAL"
};
var createDiv = function (className) {
    var element = document.createElement("div");
    element.className = className;
    return element;
};
var createBoardDiv = function (row, col, teamName) {
    var element;
    if (col === 0 || col === 7) {
        element = createDiv("col-3");
    }
    else {
        element = createDiv("col-1");
    }
    element.setAttribute("row", row.toString());
    element.setAttribute("col", col.toString());
    element.setAttribute("teamName", teamName.split(" ").join(""));
    if (row === 0 && col === 0) {
        element.innerHTML = teamName;
    }
    else if (row === 0) {
        element.innerHTML = boardRow1[col];
    }
    else if (col === 0) {
        element.innerHTML = "Player " + row;
    }
    return element;
};
var Game = /** @class */ (function () {
    function Game() {
        this.teams = new Array();
        startGameButton.setAttribute("disabled", "true");
        (currentRow = 1), (currentCol = 1);
        this.teams.push(new Team("TEAM 1"));
        this.teams.push(new Team("TEAM 2"));
        this.displayTeam(this.teams[0].name, "TEAM1");
        this.displayTeam(this.teams[1].name, "TEAM2");
        this.startTimer();
    }
    Game.prototype.displayTeam = function (teamName, id) {
        var displayElement = document.querySelector("#" + id);
        displayElement.innerHTML = "";
        for (var i = 0; i < 11; i++) {
            var row = createDiv("row");
            for (var j = 0; j < 8; j++) {
                var div = createBoardDiv(i, j, teamName);
                row.append(div);
            }
            displayElement.append(row);
        }
    };
    Game.prototype.startTimer = function () {
        var _this = this;
        var timer = document.querySelector("#timer");
        var generate = document.querySelector("#generate");
        generate.setAttribute("disabled", "true");
        hit2.setAttribute("disabled", "true");
        this.currentPlayingTeam = this.teams[0];
        var time = 1;
        var interval = setInterval(function () {
            timer.innerHTML = (time++).toString();
            if (time === 31) {
                (currentRow = 1), (currentCol = 1);
                hit1.setAttribute("disabled", "true");
                hit2.removeAttribute("disabled");
                _this.currentPlayingTeam = _this.teams[1];
            }
            else if (time === 61) {
                hit1.setAttribute("disabled", "true");
                hit2.setAttribute("disabled", "true");
                generate.removeAttribute("disabled");
                gameStarted = false;
                _this.currentPlayingTeam = null;
                clearInterval(interval);
            }
        }, 1000);
    };
    return Game;
}());
var Team = /** @class */ (function () {
    function Team(name) {
        this.players = new Array(10);
        this.teamScore = 0;
        this.name = name;
        for (var i = 1; i < 11; i++) {
            var currentPlayer = new Player("Player " + i);
            this.players[i - 1] = currentPlayer;
        }
    }
    return Team;
}());
var Player = /** @class */ (function () {
    function Player(name) {
        this.name = name;
    }
    return Player;
}());
var score1 = 0, score2 = 0;
var game;
var totalScore;
var updateScore = function (score, id) {
    var divId = id === "TEAM 1" ? "score1" : "score2";
    var updateDiv = document.querySelector("#" + divId);
    var currentScore = parseInt(updateDiv.innerHTML);
    updateDiv.innerHTML = (currentScore + score).toString();
};
var updatePlayerScore = function (score, row, name) {
    var updateDiv = (document.querySelector("[teamname=\"" + name + "\"][row=\"" + currentRow + "\"][col=\"7\"]"));
    var currentScore = updateDiv.innerHTML;
    if (!currentScore) {
        totalScore = score;
    }
    else {
        totalScore += score;
    }
    if (name === "TEAM1") {
        if (team1Score < totalScore) {
            team1Score = Math.max(team1Score, totalScore);
            team1Player = row;
        }
    }
    else {
        if (team2Score < totalScore) {
            team2Score = Math.max(team2Score, totalScore);
            team2Player = row;
        }
    }
    updateDiv.innerHTML = totalScore.toString();
};
var handleBatting = function (team) {
    var name = team.name.split(" ").join("");
    var currentBox = (document.querySelector("[teamname=\"" + name + "\"][row=\"" + currentRow + "\"][col=\"" + currentCol + "\"]"));
    var run = Math.floor(Math.random() * 7);
    if (currentRow <= 10) {
        updateScore(run, team.name);
        updatePlayerScore(run, currentRow, name);
        currentBox.innerHTML = run.toString();
        if (run === 0) {
            currentRow++;
            currentCol = 1;
        }
        else {
            if (currentCol === 6) {
                currentRow++;
                currentCol = 1;
            }
            else {
                currentCol++;
            }
        }
    }
};
document.querySelector("#startGame").addEventListener("click", function () {
    var score1div = document.querySelector("#score1");
    var score2div = document.querySelector("#score2");
    score1div.innerHTML = "";
    score2div.innerHTML = "";
    score1div.innerHTML = "0";
    score2div.innerHTML = "0";
    if (!gameStarted) {
        game = new Game();
        (currentRow = 1), (currentCol = 1);
        var hit1_1 = document.querySelector("#hit1");
        var hit2_1 = document.querySelector("#hit2");
        generateButton.setAttribute("disabled", "true");
        finalResultDiv.innerHTML = "";
        hit1_1.removeAttribute("disabled");
        hit1_1.addEventListener("click", function () {
            handleBatting(game.currentPlayingTeam);
        });
        hit2_1.addEventListener("click", function () {
            handleBatting(game.currentPlayingTeam);
        });
    }
});
var generateButton = document.querySelector("#generate");
generateButton.addEventListener("click", function () {
    var row1 = createDiv("row");
    var row2 = createDiv("col-12 bold");
    var row3 = createDiv("col-12");
    var row4 = createDiv("col-12 bold");
    var row5 = createDiv("col-12 bold");
    var row6 = createDiv("col-12 bold");
    row3.innerHTML = "MAN OF THE MATCH";
    var score1 = parseInt(document.querySelector("#score1").innerHTML);
    var score2 = parseInt(document.querySelector("#score2").innerHTML);
    if (score1 > score2) {
        row2.innerHTML = "MATCH WON BY TEAM 1";
        row4.innerHTML = "PLAYER " + team1Player;
        row5.innerHTML = "TEAM 1";
        row6.innerHTML = "SCORE " + team1Score;
    }
    else {
        row2.innerHTML = "MATCH WON BY TEAM 2";
        row4.innerHTML = "PLAYER " + team2Player;
        row5.innerHTML = "TEAM 2";
        row6.innerHTML = "SCORE " + team2Score;
    }
    row1.append(row2, row3, row4, row5, row6);
    finalResultDiv.append(row1);
    startGameButton.removeAttribute("disabled");
    (team1Score = 0), (team2Score = 0);
});
