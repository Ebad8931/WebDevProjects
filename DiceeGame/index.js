function rollDice() {
    var diceRollResult = Math.ceil(Math.random() * 6);
    return diceRollResult;
}

function updateDiceForPlayer(player, diceRollResult) {
    var diceImage = document.querySelector(".img" + player);
    diceImage.setAttribute("src", "images/dice" + diceRollResult + ".png");
}

// get scores
var player1Score = rollDice();
var player2Score = rollDice();

// update images
updateDiceForPlayer(1, player1Score);
updateDiceForPlayer(2, player2Score);

// announce result
console.log(player1Score + " " + player2Score);
if (player1Score > player2Score) {
    document.querySelector("h1").textContent = "🚩Player 1 Wins!";
} else if (player2Score > player1Score) {
    document.querySelector("h1").textContent = "Player 2 Wins!🚩";
} else {
    document.querySelector("h1").textContent = "Draw";
}
