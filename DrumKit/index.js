var buttons = document.querySelectorAll(".drum")


function playSound(drumLetter) {
    var audioLocation = "sounds/"
    switch (drumLetter) {
        case 'w':
            audioLocation += "tom-4.mp3";
            break;
        case 'a':
            audioLocation += "tom-1.mp3";
            break;
        case 's':
            audioLocation += "tom-2.mp3";
            break;
        case 'd':
            audioLocation += "tom-3.mp3";
            break;
        case 'j':
            audioLocation += "snare.mp3";
            break;
        case 'k':
            audioLocation += "kick-bass.mp3";
            break;
        case 'l':
            audioLocation += "crash.mp3";
            break;
        default:
            console.log(drumLetter + " is an invalid choice!")
            return;
    }
    
    var audio = new Audio(audioLocation);
    audio.play();
}


function buttonAnimation(drumLetter) {
    if (!['w', 'a', 's', 'd', 'j', 'k', 'l'].includes(drumLetter)) {
        return;
    } 
    var activeButton = document.querySelector("." + drumLetter);
    activeButton.classList.add("button-pressed");
    setTimeout(function() {
        activeButton.classList.remove("button-pressed");
    }, 100);
}


for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        var drumLetter = this.textContent.toLowerCase();
        buttonAnimation(drumLetter);
        playSound(drumLetter);      
    });
}

document.addEventListener("keypress", function(event) {
    var drumLetter = event.key.toLowerCase();
    buttonAnimation(drumLetter);
    playSound(drumLetter);
});