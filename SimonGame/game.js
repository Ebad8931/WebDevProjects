// Game varibles
var buttonColors = ["red", "blue", "green", "yellow"];
var game_started = false; 

var gamePattern;
var userClickedPattern;

var level;


// initialize game
function startGame() {
    gamePattern = [];
    userClickedPattern = [];
    level = 0;
    game_started = true;
}


// event handler when a key is pressed
$(document).keypress(function (e) {  
    if (!game_started) {
        startGame();
        nextSequence();
    }
});


// event handler when user clicks a button
$(".btn").click(function () {
    if (game_started) {
        var userChosenColor = $(this).attr("id");    
        userClickedPattern.push(userChosenColor);
        playColorSound(userChosenColor);
        animatePress(userChosenColor);
        
        currentLevel = userClickedPattern.length - 1;
        checkAnswer(currentLevel);
    } 
});


function nextSequence() {
    $("#level-title").text("Level " + ++level);
    userClickedPattern = [];
    var randomNumber = Math.floor(Math.random() * buttonColors.length);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);
    playColorSound(randomChosenColor);
    flashColor(randomChosenColor);
}


function checkAnswer(currentLevel) {

    if (userClickedPattern[currentLevel] == gamePattern[currentLevel]){
        // right answer
        
        // checking if user has finished entering the correct sequence
        if (userClickedPattern.length == gamePattern.length) {
            setTimeout(nextSequence, 1000);
        }

    } else {
        // wrong answer

        $("#level-title").text("Game Over! Press Any Key to Restart");
        
        playWrongSound();
        $("body").addClass("game-over");
        setTimeout(() => {
            $("body").removeClass("game-over");
        }, 200);
        
        game_started = false;
    }
}


// Helper functions
// ----------------

function playColorSound(color) {
    if (!buttonColors.includes(color)) {
        return;
    }
    var colorSound = new Audio("sounds/" + color + ".mp3");
    colorSound.play();
}


function flashColor(color) {
    if (!buttonColors.includes(color)) {
        return;
    }
    $("#" + color).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    
}


function animatePress(color) {
    $("#" + color).addClass("pressed");
    setTimeout(() => {
        $("#" + color).removeClass("pressed");
    }, 100);
}


function playWrongSound() {
    var wrongSound = new Audio("sounds/wrong.mp3");
    wrongSound.play();
}