// OINANCE KEYBOARD — WORKING VERSION

const typedText = document.getElementById("typedText");
const clearButton = document.getElementById("clearButton");

const letterKeyboard = document.getElementById("letterKeyboard");
const numberKeyboard = document.getElementById("numberKeyboard");
const numberButton = document.getElementById("numberButton");
const letterButton = document.getElementById("letterButton");

const featurePanel = document.getElementById("featurePanel");

let typedValue = "";
let shiftOn = true;
let activePanel = null;
let calculatorValue = "";
const clipboardHistory = [];

// TYPING AREA
function updateText() {
  typedText.textContent = typedValue || "Start typing...";
  typedText.style.color = typedValue ? "#fff" : "#777";
}

function insertText(value) {
  typedValue += value;
  updateText();
}

function deleteCharacter() {
  typedValue = Array.from(typedValue).slice(0, -1).join("");
  updateText();
}

// CLEAR TEXT AND SAVE TO CLIPBOARD
clearButton.addEventListener("click", () => {
  if (typedValue.trim()) {
    clipboardHistory.unshift(typedValue);
    clipboardHistory.splice(10);
    renderClipboard();
  }

  typedValue = "";
  updateText();
});

// UPPERCASE AND LOWERCASE
function updateLetterCase() {
  document.querySelectorAll(".key.letter").forEach(key => {
    key.textContent = shiftOn
      ? key.textContent.toUpperCase()
      : key.textContent.toLowerCase();
  });

  document.getElementById("shiftButton")
    ?.classList.toggle("shift-active", shiftOn);
}

// SWITCH BETWEEN LETTERS AND NUMBERS
numberButton.addEventListener("click", () => {
  letterKeyboard.classList.add("hidden");
  numberKeyboard.classList.remove("hidden");

  numberButton.classList.add("hidden");
  letterButton.classList.remove("hidden");
});

letterButton.addEventListener("click", () => {
  numberKeyboard.classList.add("hidden");
  letterKeyboard.classList.remove("hidden");

  letterButton.classList.add("hidden");
  numberButton.classList.remove("hidden");
});

// KEYBOARD BUTTONS
document.addEventListener("click", event => {
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

  if (value.toLowerCase() === "space") {
    insertText(" ");
    return;
  }

  if (value === "↵") {
    insertText("\n");
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

// SPACE AND ENTER
document.getElementById("spaceButton")
  .addEventListener("click", () => insertText(" "));

document.getElementById("enterButton")
  .addEventListener("click", () => insertText("\n"));

// OPEN AND CLOSE FEATURE PANELS
const toolButtons = document.querySelectorAll(".tool-button");
const panels = document.querySelectorAll(".panel-content");

toolButtons.forEach(button => {
  button.addEventListener("click", () => {
    const panelId = button.dataset.panel;

    if (!panelId) {
      alert("Voice typing will be added in a later version.");
      return;
    }

    if (activePanel === panelId) {
      featurePanel.classList.remove("open");

      panels.forEach(panel => panel.classList.remove("active"));
      toolButtons.forEach(item => item.classList.remove("active"));

      activePanel = null;
      return;
    }

    panels.forEach(panel => panel.classList.remove("active"));
    toolButtons.forEach(item => item.classList.remove("active"));

    const selectedPanel = document.getElementById(panelId);

    if (!selectedPanel) return;

    selectedPanel.classList.add("active");
    button.classList.add("active");
    featurePanel.classList.add("open");

    activePanel = panelId;
  });
});

// SUGGESTIONS
document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => {
    const word = button.textContent.trim();

    insertText(
      typedValue && !typedValue.endsWith(" ")
        ? " " + word
        : word
    );
  });
});

// EMOJI DESIGN COLLECTIONS
document.querySelectorAll(".emoji-collection").forEach(button => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    const preview = document.getElementById("emojiPreview");
    const status = document.getElementById("emojiStatus");

    if (!image || !preview) return;

    preview.replaceChildren();

    const fullImage = document.createElement("img");
    fullImage.src = image.getAttribute("src");
    fullImage.alt = image.alt;

    fullImage.onload = () => {
      preview.classList.remove("hidden");
      if (status) {
        status.textContent = "Collection selected successfully.";
      }
    };

    fullImage.onerror = () => {
      preview.classList.add("hidden");

      if (status) {
        status.textContent =
          "Image not found. Please check the image filename in GitHub.";
      }
    };

    preview.appendChild(fullImage);
  });
});

// CLIPBOARD
function renderClipboard() {
  const box = document.getElementById("clipboardItems");
  if (!box) return;

  box.replaceChildren();

  if (clipboardHistory.length === 0) {
    box.textContent = "Your saved text will appear here.";
    return;
  }

  clipboardHistory.forEach(item => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = item;

    button.addEventListener("click", () => {
      insertText(item);
    });

    box.appendChild(button);
  });
}

// CALCULATOR
const calculatorDisplay =
  document.getElementById("calculatorDisplay");

function updateCalculatorDisplay(value) {
  calculatorDisplay.textContent = value || "0";
}

function calculate(expression) {
  const tokens = expression.match(
    /\d*\.?\d+|[()+*/-]/g
  ) || [];

  if (
    !expression ||
    tokens.join("") !== expression.replace(/\s/g, "")
  ) {
    throw new Error("Invalid calculation");
  }

  let index = 0;

  function number() {
    const token = tokens[index++];

    if (token === "+") return number();
    if (token === "-") return -number();

    if (token === "(") {
      const result = addition();

      if (tokens[index++] !== ")") {
        throw new Error("Missing bracket");
      }

      return result;
    }

    const value = Number(token);

    if (token === undefined || !Number.isFinite(value)) {
      throw new Error("Invalid number");
    }

    return value;
  }

  function multiplication() {
    let result = number();

    while (
      tokens[index] === "*" ||
      tokens[index] === "/"
    ) {
      const operator = tokens[index++];
      const next = number();

      result = operator === "*"
        ? result * next
        : result / next;
    }

    return result;
  }

  function addition() {
    let result = multiplication();

    while (
      tokens[index] === "+" ||
      tokens[index] === "-"
    ) {
      const operator = tokens[index++];
      const next = multiplication();

      result = operator === "+"
        ? result + next
        : result - next;
    }

    return result;
  }

  const result = addition();

  if (index !== tokens.length || !Number.isFinite(result)) {
    throw new Error("Cannot calculate");
  }

  return Number(result.toPrecision(12)).toString();
}

document.querySelectorAll("[data-calc]").forEach(button => {
  button.addEventListener("click", () => {
    calculatorValue += button.dataset.calc;
    updateCalculatorDisplay(calculatorValue);
  });
});

document.getElementById("calculatorClear")
  .addEventListener("click", () => {
    calculatorValue = "";
    updateCalculatorDisplay("0");
  });

document.getElementById("calculatorBackspace")
  .addEventListener("click", () => {
    calculatorValue = calculatorValue.slice(0, -1);
    updateCalculatorDisplay(calculatorValue);
  });

document.getElementById("calculatorEquals")
  .addEventListener("click", () => {
    try {
      const result = calculate(calculatorValue);

      calculatorValue = result;
      updateCalculatorDisplay(result);
      insertText(result);
    } catch {
      updateCalculatorDisplay("Error");
    }
  });

// PLACEHOLDERS FOR FEATURES NOT CONNECTED YET
document.querySelectorAll("[data-ai]").forEach(button => {
  button.addEventListener("click", () => {
    alert("The AI assistant will be connected in a later version.");
  });
});

document.getElementById("translateAction")
  .addEventListener("click", () => {
    alert("Translation will be connected in a later version.");
  });

document.getElementById("globeButton")
  .addEventListener("click", () => {
    alert("Language switching will be added later.");
  });

// STARTUP
updateLetterCase();
updateText();
renderClipboard();
updateCalculatorDisplay("0");

// OINANCE INDIVIDUAL EMOJI SYSTEM 🖤🐈‍⬛

const oinanceEmojiCategories = {
  smileys: [
    "😀", "😃", "😄", "😁", "😂", "🤣",
    "🥰", "😍", "😘", "😎", "😭", "😴",
    "😊", "😉", "🤗", "🥹", "😇", "🤔",
    "😢", "😡", "🥳", "🤩", "😋", "🙃"
  ],

  hearts: [
    "❤️", "🖤", "🤍", "💖", "💗", "💓",
    "💕", "💞", "💘", "💝", "💔", "❤️‍🔥",
    "💜", "💙", "💚", "💛", "🩷", "🩵"
  ],

  hands: [
    "🙏", "💪", "👏", "👍", "👎", "👌",
    "✌️", "🤞", "🤝", "🙌", "🫶", "🤲",
    "👋", "✊", "👊", "🤜", "🤛", "🖐️"
  ],

  animals: [
    "🐈‍⬛", "🐈", "🐕", "🐺", "🦊", "🐼",
    "🐻", "🐻‍❄️", "🦁", "🐯", "🐸", "🐵",
    "🐰", "🦋", "🐍", "🦅", "🦉", "🐬"
  ],

  symbols: [
    "🔥", "✨", "⭐", "🌟", "💫", "⚡",
    "☀️", "🌙", "🌈", "💯", "❣️", "💢",
    "✅", "❌", "💎", "🎉", "🎁", "👑"
  ]
};

const oinanceEmojiGrid =
  document.getElementById("standardEmojiGrid");

const oinanceEmojiTabs =
  document.querySelectorAll(".emoji-tab");

// Display a category of individual emojis
function showOinanceEmojiCategory(category) {
  if (!oinanceEmojiGrid) return;

  const emojis = oinanceEmojiCategories[category];

  if (!emojis) return;

  oinanceEmojiGrid.replaceChildren();

  emojis.forEach(emoji => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "standard-emoji";
    button.textContent = emoji;
    button.dataset.emoji = emoji;
    button.setAttribute("aria-label", emoji);

    oinanceEmojiGrid.appendChild(button);
  });

  oinanceEmojiTabs.forEach(tab => {
    tab.classList.toggle(
      "active",
      tab.dataset.emojiCategory === category
    );
  });
}

// Switch emoji categories
oinanceEmojiTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    showOinanceEmojiCategory(tab.dataset.emojiCategory);
  });
});

// Insert the selected emoji into the typing area
if (oinanceEmojiGrid) {
  oinanceEmojiGrid.addEventListener("click", event => {
    const button = event.target.closest(".standard-emoji");

    if (!button) return;

    const emoji = button.dataset.emoji;

    if (emoji) {
      insertText(emoji);
    }
  });
}

// Load the smileys category when the keyboard starts
showOinanceEmojiCategory("smileys");
