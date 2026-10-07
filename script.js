const typedText = document.getElementById("typedText");

const letterKeyboard = document.getElementById("letterKeyboard");
const numberKeyboard = document.getElementById("numberKeyboard");

const numberButton = document.getElementById("numberButton");
const letterButton = document.getElementById("letterButton");

const calculatorButton = document.getElementById("calculatorButton");

let text = "";
let shiftOn = true;


// ======================================
// LETTER / NUMBER KEYBOARD
// ======================================

numberButton.addEventListener("click", function () {

  letterKeyboard.style.display = "none";
  numberKeyboard.style.display = "block";

  numberButton.style.display = "none";
  letterButton.style.display = "block";

});


letterButton.addEventListener("click", function () {

  numberKeyboard.style.display = "none";
  letterKeyboard.style.display = "block";

  letterButton.style.display = "none";
  numberButton.style.display = "block";

});


// ======================================
// KEYBOARD BUTTONS
// ======================================

document.addEventListener("click", function (event) {

  const key = event.target;

  if (!key.classList.contains("key")) {
    return;
  }

  const value = key.textContent.trim();


  // SHIFT

  if (value === "⇧") {

    shiftOn = !shiftOn;

    key.style.color = shiftOn ? "#fff" : "#777";

    return;
  }


  // BACKSPACE

  if (value === "⌫") {

    text = text.slice(0, -1);

    updateText();

    return;
  }


  // SPACE

  if (value === "SPACE") {

    text += " ";

    updateText();

    return;
  }


  // ENTER

  if (value === "↵") {

    text += "\n";

    updateText();

    return;
  }


  // ABC / 123

  if (value === "123" || value === "ABC") {
    return;
  }


  // GLOBE

  if (value === "🌐") {

    alert("OINANCE Translation is coming next.");

    return;
  }


  // NORMAL KEY

  let character = value;

  if (
    /^[A-Z]$/.test(character) &&
    !shiftOn
  ) {

    character = character.toLowerCase();

  }

  text += character;

  updateText();


  // Turn shift off after first letter

  if (
    shiftOn &&
    /^[A-Z]$/.test(value)
  ) {

    shiftOn = false;

  }

});


// ======================================
// UPDATE TEXT
// ======================================

function updateText() {

  if (text.length === 0) {

    typedText.textContent = "Start typing...";

    typedText.style.color = "#777";

  } else {

    typedText.textContent = text;

    typedText.style.color = "#fff";

  }

}


// ======================================
// CALCULATOR
// ======================================

calculatorButton.addEventListener("click", function () {

  const calculation = prompt(
    "OINANCE Calculator\n\nEnter a calculation:\nExample: 250000 + 75000"
  );


  if (calculation === null) {
    return;
  }


  try {

    const result = Function(
      '"use strict"; return (' + calculation + ')'
    )();


    text += result;

    updateText();

  }

  catch (error) {

    alert(
      "OINANCE Calculator\n\nInvalid calculation."
    );

  }

});
