/* =========================================
   KEYBOARD ELEMENTS
========================================= */

const typedText = document.getElementById("typedText");
const clearButton = document.getElementById("clearButton");

const letterKeyboard = document.getElementById("letterKeyboard");
const numberKeyboard = document.getElementById("numberKeyboard");

const numberButton = document.getElementById("numberButton");
const letterButton = document.getElementById("letterButton");
const shiftButton = document.getElementById("shiftButton");

const spaceButton = document.getElementById("spaceButton");
const enterButton = document.getElementById("enterButton");

const featurePanel = document.getElementById("featurePanel");

let text = "";
let shiftOn = true;
let activePanel = null;
let calculatorValue = "";
let lastAnswer = null;

const clipboardHistory = [];


/* =========================================
   EMOJI IMAGE FILES
========================================= */

const emojiDesigns = [
  {
    name: "Collection 1",
    image: "file_00000000061c8210aa2fa4943eef51be.jpg"
  },
  {
    name: "Collection 2",
    image: "file_000000000a3081f490c98c485f6b3f66.jpg"
  },
  {
    name: "Collection 3",
    image: "file_00000000d2f08210bcccd3dcab977e0a.jpg"
  }
];


/* =========================================
   UPDATE TYPING AREA
========================================= */

function updateText() {
  if (text.length === 0) {
    typedText.textContent = "Start typing...";
    typedText.style.color = "#777";
    return;
  }

  typedText.textContent = text;
  typedText.style.color = "#fff";
}


/* =========================================
   INSERT TEXT
========================================= */

function insertText(value) {
  text += value;
  updateText();
}


/* =========================================
   DELETE LAST CHARACTER
========================================= */

function deleteCharacter() {
  text = Array.from(text).slice(0, -1).join("");
  updateText();
}


/* =========================================
   CLEAR TEXT
========================================= */

clearButton.addEventListener("click", function () {
  if (text.length > 0) {
    clipboardHistory.unshift(text);
    clipboardHistory.splice(10);
    renderClipboard();
  }

  text = "";
  updateText();
});


/* =========================================
   UPPERCASE / LOWERCASE
========================================= */

function updateLetterCase() {
  document.querySelectorAll(".key.letter").forEach(function (key) {
    const original = key.textContent.trim();

    key.textContent = shiftOn
      ? original.toUpperCase()
      : original.toLowerCase();
  });

  if (shiftButton) {
    shiftButton.classList.toggle("shift-active", shiftOn);
  }
}


/* =========================================
   LETTER / NUMBER SWITCH
========================================= */

numberButton.addEventListener("click", function () {
  letterKeyboard.classList.add("hidden");
  numberKeyboard.classList.remove("hidden");

  numberButton.classList.add("hidden");
  letterButton.classList.remove("hidden");
});


letterButton.addEventListener("click", function () {
  numberKeyboard.classList.add("hidden");
  letterKeyboard.classList.remove("hidden");

  letterButton.classList.add("hidden");
  numberButton.classList.remove("hidden");
});


/* =========================================
   KEYBOARD CLICK HANDLER
========================================= */

document.addEventListener("click", function (event) {
  const key = event.target.closest(".key");

  if (!key) return;

  const value = key.textContent.trim();

  if (value === "⇧") {
    shiftOn = !shiftOn;
    updateLetterCase();
    return;
  }

  if (value === "⌫") {
    deleteCharacter();
    return;
  }

  if (value === "SPACE" || value.toLowerCase() === "space") {
    insertText(" ");
    return;
  }

  if (value === "↵") {
    insertText("\n");
    return;
  }

  if (value === "123" || value === "ABC") {
    return;
  }

  let character = value;

  if (/^[A-Z]$/.test(character) && !shiftOn) {
    character = character.toLowerCase();
  }

  insertText(character);

  if (shiftOn && /^[A-Z]$/.test(value)) {
    shiftOn = false;
    updateLetterCase();
  }
});


/* =========================================
   BOTTOM CONTROLS
========================================= */

spaceButton.addEventListener("click", function () {
  insertText(" ");
});

enterButton.addEventListener("click", function () {
  insertText("\n");
});


/* =========================================
   FEATURE PANELS
========================================= */

const toolButtons = document.querySelectorAll(".tool-button");
const panels = document.querySelectorAll(".panel-content");

toolButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const panelId = button.dataset.panel;

    if (!panelId) {
      alert(
        "Voice-to-text will be connected when we build the Android keyboard."
      );
      return;
    }

    if (activePanel === panelId) {
      featurePanel.classList.remove("open");

      panels.forEach(function (panel) {
        panel.classList.remove("active");
      });

      toolButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      activePanel = null;
      return;
    }

    panels.forEach(function (panel) {
      panel.classList.remove("active");
    });

    toolButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    const selectedPanel = document.getElementById(panelId);

    if (!selectedPanel) return;

    selectedPanel.classList.add("active");
    button.classList.add("active");

    featurePanel.classList.add("open");
    activePanel = panelId;
  });
});


/* =========================================
   SUGGESTION BUTTONS
========================================= */

document.querySelectorAll(".suggestion").forEach(function (button) {
  button.addEventListener("click", function ()
