const typedText = document.getElementById("typedText");
const keys = document.querySelectorAll(".key");

let text = "";
let shiftOn = true;

keys.forEach(function(key) {

  key.addEventListener("click", function() {

    const value = key.textContent.trim();

    // Shift
    if (value === "⇧") {
      shiftOn = !shiftOn;
      key.style.color = shiftOn ? "#fff" : "#777";
      return;
    }

    // Backspace
    if (value === "⌫") {
      text = text.slice(0, -1);
      updateText();
      return;
    }

    // Space
    if (value === "SPACE") {
      text += " ";
      updateText();
      return;
    }

    // Enter
    if (value === "↵") {
      text += "\n";
      updateText();
      return;
    }

    // Number / symbol keyboard
    if (value === "123") {
      alert("Number & symbol keyboard coming next.");
      return;
    }

    // Globe
    if (value === "🌐") {
      alert("Language & translation keyboard coming next.");
      return;
    }

    // Normal letters
    let letter = value;

    if (!shiftOn) {
      letter = letter.toLowerCase();
    }

    text += letter;

    updateText();

    // Automatically turn shift off after typing
    if (shiftOn) {
      shiftOn = false;
    }

  });

});


function updateText() {

  if (text.length === 0) {

    typedText.textContent = "Start typing...";
    typedText.style.color = "#777";

  } else {

    typedText.textContent = text;
    typedText.style.color = "#fff";

  }

}
