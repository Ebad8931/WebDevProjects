var buttonColors = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];


function animateColor(color) {
    if (!buttonColors.includes(color)) {
        return;
    }
    $("#" + color).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    
}


function playColorSound(color) {
    if (!buttonColors.includes(color)) {
        return;
    }
    var colorSound = new Audio("sounds/" + color + ".mp3");
    colorSound.play();
}


function playWrongSound() {
    var wrongSound = new Audio("sounds/wrong.mp3");
    wrongSound.play();
}


function nextSequence() {
    var randomNumber = Math.floor(Math.random() * buttonColors.length);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);
    playColorSound(randomChosenColor);
    animateColor(randomChosenColor);
}


$(".btn").click(function () { 
    var userChosenColor = $(this).attr("id");    
    userClickedPattern.push(userChosenColor);
    console.log(userClickedPattern);
});
