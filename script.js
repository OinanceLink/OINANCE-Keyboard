// ============================================
// OINANCE KEYBOARD — MAIN JAVASCRIPT
// ============================================

const typedText = document.getElementById("typedText");
const clearButton = document.getElementById("clearButton");

const letterKeyboard = document.getElementById("letterKeyboard");
const numberKeyboard = document.getElementById("numberKeyboard");
const numberButton = document.getElementById("numberButton");
const letterButton = document.getElementById("letterButton");

const spaceButton = document.getElementById("spaceButton");
const emojiButton = document.getElementById("emojiButton");
const voiceButton = document.getElementById("voiceButton");

const featurePanel = document.getElementById("featurePanel");
const featureToolbar = document.getElementById("featureToolbar");

let typedValue = "";
let shiftOn = true;
let activePanel = null;
let calculatorValue = "";
let spaceHoldTimer = null;
let spaceLongPressTriggered = false;
let voiceRecognition = null;
let voiceIsListening = false;

const clipboardHistory = [];


// ============================================
// TEXT ENTRY
// ============================================

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


// ============================================
// CLEAR TEXT AND SAVE TO CLIPBOARD
// ============================================

clearButton.addEventListener("click", () => {
  if (typedValue.trim()) {
    clipboardHistory.unshift(typedValue);
    clipboardHistory.splice(10);
    renderClipboard();
  }

  typedValue = "";
  updateText();
});


// ============================================
// LETTER CASE
// ============================================

function updateLetterCase() {
  document.querySelectorAll(".key.letter").forEach(key => {
    const letter = key.dataset.originalLetter ||
      key.textContent.trim();

    key.dataset.originalLetter = letter.toLowerCase();

    key.textContent = shiftOn
      ? letter.toUpperCase()
      : letter.toLowerCase();
  });

  document.getElementById("shiftButton")
    ?.classList.toggle("shift-active", shiftOn);
}


// ============================================
// SWITCH BETWEEN LETTERS AND NUMBERS
// ============================================

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


// ============================================
// MAIN KEYBOARD INPUT
// ============================================

document.addEventListener("click", event => {
  const key = event.target.closest(".key");

  if (!key) return;

  const value = key.dataset.character || key.textContent.trim();

  if (value === "⇧") {
    shiftOn = !shiftOn;
    updateLetterCase();
    return;
  }

  if (value === "⌫") {
    deleteCharacter();
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


// ============================================
// SPACE BAR
// Tap = space
// Hold = open tools
// ============================================

function openToolsMenu() {
  featureToolbar.classList.remove("hidden");
  featureToolbar.classList.add("tools-visible");
}

function closeToolsMenu() {
  featureToolbar.classList.add("hidden");
  featureToolbar.classList.remove("tools-visible");
  closeFeaturePanel();
}

function toggleToolsMenu() {
  if (featureToolbar.classList.contains("hidden")) {
    openToolsMenu();
  } else {
    closeToolsMenu();
  }
}

spaceButton.addEventListener("pointerdown", event => {
  if (event.button !== undefined && event.button !== 0) return;

  spaceLongPressTriggered = false;
  clearTimeout(spaceHoldTimer);

  spaceHoldTimer = setTimeout(() => {
    spaceLongPressTriggered = true;
    toggleToolsMenu();
  }, 550);
});

function cancelSpaceHold() {
  clearTimeout(spaceHoldTimer);
  spaceHoldTimer = null;
}

spaceButton.addEventListener("pointerup", cancelSpaceHold);
spaceButton.addEventListener("pointerleave", cancelSpaceHold);
spaceButton.addEventListener("pointercancel", cancelSpaceHold);

spaceButton.addEventListener("click", event => {
  event.preventDefault();

  if (spaceLongPressTriggered) {
    spaceLongPressTriggered = false;
    return;
  }

  insertText(" ");
});


// ============================================
// OPEN AND CLOSE FEATURE PANELS
// ============================================

const toolButtons = document.querySelectorAll(".tool-button");
const panels = document.querySelectorAll(".panel-content");

function closeFeaturePanel() {
  featurePanel.classList.remove("open");

  panels.forEach(panel => panel.classList.remove("active"));

  toolButtons.forEach(button => button.classList.remove("active"));

  emojiButton.classList.remove("active");

  activePanel = null;
}

function openFeaturePanel(panelId, selectedButton = null) {
  const selectedPanel = document.getElementById(panelId);

  if (!selectedPanel) return;

  if (activePanel === panelId) {
    closeFeaturePanel();
    return;
  }

  panels.forEach(panel => panel.classList.remove("active"));
  toolButtons.forEach(button => button.classList.remove("active"));
  emojiButton.classList.remove("active");

  selectedPanel.classList.add("active");
  featurePanel.classList.add("open");

  if (selectedButton) {
    selectedButton.classList.add("active");
  }

  activePanel = panelId;
}

toolButtons.forEach(button => {
  button.addEventListener("click", () => {
    const panelId = button.dataset.panel;

    if (panelId) {
      openFeaturePanel(panelId, button);
    }
  });
});


// ============================================
// PERMANENT EMOJI BUTTON
// ============================================

emojiButton.addEventListener("click", () => {
  openFeaturePanel("emojiPanel", emojiButton);
});


// ============================================
// OINANCE VOICE TYPING
// Prevent duplicate sessions and repeated results
// ============================================

function cleanVoiceTranscript(text) {
  let result = String(text || "").trim();

  // Remove immediately repeated words:
  // "how are you how are you" -> "how are you"
  const words = result.split(/\s+/);
  const cleanedWords = [];

  for (let i = 0; i < words.length;) {
    let duplicateLength = 0;

    // Look for repeated sequences of up to 6 words.
    for (let size = Math.min(6, Math.floor((words.length - i) / 2));
         size >= 1;
         size--) {
      const first = words.slice(i, i + size);
      const second = words.slice(i + size, i + size * 2);

      const same = first.every((word, index) =>
        word.toLowerCase().replace(/[.,!?;:]+$/, "") ===
        second[index].toLowerCase().replace(/[.,!?;:]+$/, "")
      );

      if (same) {
        duplicateLength = size;
        break;
      }
    }

    if (duplicateLength > 0) {
      cleanedWords.push(...words.slice(i, i + duplicateLength));
      i += duplicateLength * 2;

      // Skip additional copies of the same sequence.
      while (
        i + duplicateLength <= words.length &&
        words.slice(i, i + duplicateLength).every((word, index) =>
          word.toLowerCase().replace(/[.,!?;:]+$/, "") ===
          cleanedWords[cleanedWords.length - duplicateLength + index]
            .toLowerCase().replace(/[.,!?;:]+$/, "")
        )
      ) {
        i += duplicateLength;
      }
    } else {
      cleanedWords.push(words[i]);
      i++;
    }
  }

  return cleanedWords.join(" ").trim();
}

voiceButton.addEventListener("click", () => {
  // Don't start another recognition session while one is active.
  if (voiceIsListening) return;

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Voice typing is not supported by this browser. " +
      "Please try Google Chrome."
    );
    return;
  }

  if (!window.isSecureContext) {
    alert(
      "Voice typing requires a secure HTTPS connection."
    );
    return;
  }

  let recognition;

  try {
    recognition = new SpeechRecognition();
  } catch (error) {
    alert("Could not prepare voice typing. Please try again.");
    return;
  }

  voiceRecognition = recognition;
  voiceIsListening = true;

  let resultInserted = false;

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  voiceButton.classList.add("active");
  voiceButton.disabled = true;
  voiceButton.setAttribute("aria-label", "Listening for speech");

  recognition.onstart = () => {
    console.log("OINANCE Voice: Listening...");
  };

  recognition.onresult = event => {
    // Insert only one final result per session.
    if (resultInserted) return;

    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript + " ";
      }
    }

    transcript = cleanVoiceTranscript(transcript);

    if (transcript) {
      resultInserted = true;
      insertText(transcript + " ");
    }
  };

  recognition.onerror = event => {
    console.error("OINANCE Voice error:", event.error);

    const messages = {
      "not-allowed":
        "Microphone access was denied. Check your browser permissions.",
      "service-not-allowed":
        "Your browser's speech service is unavailable or blocked.",
      "network":
        "Voice recognition could not connect. Check your internet connection.",
      "audio-capture":
        "No microphone is available. Check your phone's microphone.",
      "no-speech":
        "No speech was detected. Please speak clearly and try again.",
      "language-not-supported":
        "The speech service does not support this language."
    };

    if (event.error !== "no-speech") {
      alert(messages[event.error] ||
        "Voice typing failed: " + event.error);
    }
  };

  recognition.onend = () => {
    voiceIsListening = false;
    voiceRecognition = null;

    voiceButton.classList.remove("active");
    voiceButton.disabled = false;
    voiceButton.setAttribute("aria-label", "Voice typing");
  };

  try {
    recognition.start();
  } catch (error) {
    console.error("OINANCE Voice start error:", error);

    voiceIsListening = false;
    voiceRecognition = null;

    voiceButton.classList.remove("active");
    voiceButton.disabled = false;
    voiceButton.setAttribute("aria-label", "Voice typing");

    alert("Voice typing could not start. Please try again.");
  }
});


// ============================================
// WORD SUGGESTIONS
// ============================================

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


// ============================================
// INDIVIDUAL EMOJIS
// ============================================

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

const emojiGrid = document.getElementById("standardEmojiGrid");
const emojiTabs = document.querySelectorAll(".emoji-tab");

function showEmojiCategory(category) {
  if (!emojiGrid) return;

  const emojis = oinanceEmojiCategories[category];

  if (!emojis) return;

  emojiGrid.replaceChildren();

  emojis.forEach(emoji => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "standard-emoji";
    button.textContent = emoji;
    button.dataset.emoji = emoji;
    button.setAttribute("aria-label", emoji);

    emojiGrid.appendChild(button);
  });

  emojiTabs.forEach(tab => {
    tab.classList.toggle(
      "active",
      tab.dataset.emojiCategory === category
    );
  });
}

emojiTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    showEmojiCategory(tab.dataset.emojiCategory);
  });
});

if (emojiGrid) {
  emojiGrid.addEventListener("click", event => {
    const button = event.target.closest(".standard-emoji");

    if (!button) return;

    const emoji = button.dataset.emoji;

    if (emoji) insertText(emoji);
  });
}


// ============================================
// CLIPBOARD
// ============================================

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


// ============================================
// CALCULATOR
// ============================================

const calculatorDisplay =
  document.getElementById("calculatorDisplay");

function updateCalculatorDisplay(value) {
  if (calculatorDisplay) {
    calculatorDisplay.textContent = value || "0";
  }
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

    while (tokens[index] === "*" || tokens[index] === "/") {
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

    while (tokens[index] === "+" || tokens[index] === "-") {
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
  ?.addEventListener("click", () => {
    calculatorValue = "";
    updateCalculatorDisplay("0");
  });

document.getElementById("calculatorBackspace")
  ?.addEventListener("click", () => {
    calculatorValue = calculatorValue.slice(0, -1);
    updateCalculatorDisplay(calculatorValue);
  });

document.getElementById("calculatorEquals")
  ?.addEventListener("click", () => {
    try {
      const result = calculate(calculatorValue);

      calculatorValue = result;
      updateCalculatorDisplay(result);
      insertText(result);
    } catch {
      updateCalculatorDisplay("Error");
    }
  });


// ============================================
// FEATURE PLACEHOLDERS
// ============================================

document.querySelectorAll("[data-ai]").forEach(button => {
  button.addEventListener("click", () => {
    alert(
      "The AI writing assistant will be connected in a future version."
    );
  });
});

document.getElementById("translateAction")
  ?.addEventListener("click", () => {
    alert("Translation will be connected in a future version.");
  });

document.getElementById("globeButton")
  ?.addEventListener("click", () => {
    alert("Language switching will be added in a future version.");
  });


// ============================================
// STARTUP
// ============================================

updateLetterCase();
updateText();
renderClipboard();
updateCalculatorDisplay("0");
showEmojiCategory("smileys");
