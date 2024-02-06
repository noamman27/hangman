let wordThisRound = "";
let guesses = [];
let counter = 0;
let gameOver = true;
const failLimit = 9;
const wordsAPI2 = "https://random-word-api.vercel.app/api?words=1";
addEventListener(`keydown`, keyCheck);
// check key and call function
function keyCheck(e) {
  hangMan(e.key);
}
function setMessage(message) {
  // set messages for html
  document.getElementById("message-area").innerHTML = message;
}
function hangMan(letter) {
  if (!gameOver) {
    // so you cant guess after game is over
    if (letter.length == 1 && /^[a-zA-Z]+$/.test(letter)) {
      // make sure its a letter
      if (guesses.includes(letter)) {
        // cant guess again
        setMessage(
          `You already guessed: ${letter}, please type the next letter you want to guess`
        );
        return;
      }
      guesses.push(letter);
      if (wordThisRound.includes(letter)) {
        // if its in the word
        draw();
      } else {
        counter++;
        drawFail();
      }
    } else {
      // not a letter
      setMessage(
        `You guessed: ${letter}, this is not a letter! Please type a letter you want to guess`
      );
    }
  } else {
    // lost
    setMessage("Game over, press the button to start a new game");
  }
  document.getElementById("image").innerHTML = counter;
  console.log("fail counter " + counter);
}
function draw() {
  let str = "";
  document.getElementById("word").innerHTML = "";
  gameOver = true;
  for (let i = 0; i < wordThisRound.length; i++) {
    // drawing the word
    let chr = "_";
    if (guesses.includes(wordThisRound.charAt(i))) {
      chr = wordThisRound.charAt(i);
      setMessage(
        `You guessed: ${chr}, correct guess! please type the next letter you want to guess`
      );
    } else {
      gameOver = false;
      // lost
    }
    str += "_";
    // adding to word
    document.getElementById(
      "word"
    ).innerHTML += `<span class = "displayChar">${chr}</span>`;
  }
  if (gameOver) {
    // win
    setMessage(`you won!!! the word was: ${wordThisRound}, good job!`);
  }
}
function drawFail() {
  // if you didnt guess right
  document.getElementById("wrongGuesses").innerHTML = "";
  for (let char of guesses) {
    if (!wordThisRound.includes(char)) {
      // not in word
      document.getElementById("wrongGuesses").innerHTML += `${char} `;
      // inform user
      setMessage(
        `You guessed: ${char}, wrong guess! ${
          failLimit - counter
        } more fails remain, please type the next letter you want to guess`
      );
    }
  }
  // showing image
  document.getElementById("image").hidden = false;
  // adding correct stage
  document.getElementById("image").src = `images/stage${counter}.png`;
  if (counter == failLimit) {
    // lost
    gameOver = true;
    setMessage(
      `you lost! btw the word was: ${wordThisRound}, press the button to start a new game`
    );
  }
}
function getRandomWord() {
  // api shenanigens insue
  const xhttpr = new XMLHttpRequest();
  xhttpr.open("GET", wordsAPI2, true);
  xhttpr.send();
  xhttpr.onload = () => {
    if (xhttpr.status === 200) {
      initNext(xhttpr.response);
    } else {
      console.log("Error: " + xhttpr.statusText);
    }
  };
}
function init() {
  // making sure user wants to restart
  if (gameOver || confirm("are you sure you want to restart?") == true) {
    let word = getRandomWord();
    // resetting the variables
    document.getElementById("wrongGuesses").innerHTML = "";
    document.getElementById("image").hidden = true;
  }
}
function initNext(word) {
  // fixing word so it is good (it was like [`word`] before)
  wordThisRound = word.substring(2, word.length - 2);
  // resetting more stuff
  counter = 0;
  guesses = [];
  draw();
  setMessage(
    "A new game just started, please type the letter you want to guess"
  );
}
// so game start when document loads
init();
