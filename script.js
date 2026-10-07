/* =========================================
   OINANCE KEYBOARD PROTOTYPE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const typedText =
  document.getElementById("typedText");

const clearButton =
  document.getElementById("clearButton");

const letterKeyboard =
  document.getElementById("letterKeyboard");

const numberKeyboard =
  document.getElementById("numberKeyboard");

const numberButton =
  document.getElementById("numberButton");

const letterButton =
  document.getElementById("letterButton");

const shiftButton =
  document.getElementById("shiftButton");

const spaceButton =
  document.getElementById("spaceButton");

const enterButton =
  document.getElementById("enterButton");

const backspaceButton =
  document.getElementById("backspaceButton");

const numberBackspace =
  document.getElementById("numberBackspace");

const featurePanel =
  document.getElementById("featurePanel");

const customEmojiGrid =
  document.getElementById("customEmojiGrid");


/* =========================================
   STATE
========================================= */

let text = "";

let shiftOn = true;

let calculatorValue = "";

let activePanel = null;


/* =========================================
   UPDATE TEXT
========================================= */

function updateText() {

  if (text.length === 0) {

    typedText.textContent =
      "Start typing...";

    typedText.style.color =
      "#777";

    return;
  }

  typedText.textContent = text;

  typedText.style.color =
    "#fff";
}


/* =========================================
   CLEAR
========================================= */

clearButton.addEventListener(
  "click",
  function () {

    text = "";

    updateText();

  }
);


/* =========================================
   LETTER / NUMBER SWITCH
========================================= */

numberButton.addEventListener(
  "click",
  function () {

    letterKeyboard.classList.add(
      "hidden"
    );

    numberKeyboard.classList.remove(
      "hidden"
    );

    numberButton.classList.add(
      "hidden"
    );

    letterButton.classList.remove(
      "hidden"
    );

  }
);


letterButton.addEventListener(
  "click",
  function () {

    numberKeyboard.classList.add(
      "hidden"
    );

    letterKeyboard.classList.remove(
      "hidden"
    );

    letterButton.classList.add(
      "hidden"
    );

    numberButton.classList.remove(
      "hidden"
    );

  }
);


/* =========================================
   KEYBOARD CLICK
========================================= */

document.addEventListener(
  "click",
  function (event) {

    const key =
      event.target.closest(".key");

    if (!key) {
      return;
    }


    const value =
      key.textContent.trim();


    /* SHIFT */

    if (value === "⇧") {

      shiftOn = !shiftOn;

      shiftButton.style.color =
        shiftOn
          ? "#fff"
          : "#777";

      return;
    }


    /* BACKSPACE */

    if (value === "⌫") {

      text =
        text.slice(0, -1);

      updateText();

      return;
    }


    /* SPACE */

    if (value === "SPACE") {

      text += " ";

      updateText();

      return;
    }


    /* ENTER */

    if (value === "↵") {

      text += "\n";

      updateText();

      return;
    }


    /* 123 / ABC */

    if (
      value === "123" ||
      value === "ABC"
    ) {

      return;
    }


    /* NORMAL CHARACTER */

    let character = value;


    if (
      /^[A-Z]$/.test(character) &&
      !shiftOn
    ) {

      character =
        character.toLowerCase();

    }


    text += character;

    updateText();


    /* AUTO LOWERCASE */

    if (
      shiftOn &&
      /^[A-Z]$/.test(value)
    ) {

      shiftOn = false;

      shiftButton.style.color =
        "#777";
    }

  }
);


/* =========================================
   BOTTOM BUTTONS
========================================= */

spaceButton.addEventListener(
  "click",
  function () {

    text += " ";

    updateText();

  }
);


enterButton.addEventListener(
  "click",
  function () {

    text += "\n";

    updateText();

  }
);


backspaceButton.addEventListener(
  "click",
  function () {

    text =
      text.slice(0, -1);

    updateText();

  }
);


numberBackspace.addEventListener(
  "click",
  function () {

    text =
      text.slice(0, -1);

    updateText();

  }
);


/* =========================================
   FEATURE PANELS
========================================= */

const toolButtons =
  document.querySelectorAll(
    ".tool-button"
  );


const panels =
  document.querySelectorAll(
    ".panel-content"
  );


toolButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        const panelId =
          button.dataset.panel;


        /* VOICE */

        if (!panelId) {

          alert(
            "Voice-to-text will be connected to the Android keyboard later."
          );

          return;
        }


        const selectedPanel =
          document.getElementById(
            panelId
          );


        if (
          activePanel === panelId
        ) {

          featurePanel.classList.remove(
            "open"
          );

          selectedPanel.classList.remove(
            "active"
          );

          button.classList.remove(
            "active"
          );

          activePanel = null;

          return;
        }


        panels.forEach(
          function (panel) {

            panel.classList.remove(
              "active"
            );

          }
        );


        toolButtons.forEach(
          function (item) {

            item.classList.remove(
              "active"
            );

          }
        );


        selectedPanel.classList.add(
          "active"
        );

        button.classList.add(
          "active"
        );

        featurePanel.classList.add(
          "open"
        );

        activePanel = panelId;

      }
    );

  }
);


/* =========================================
   SUGGESTIONS
========================================= */

document
  .querySelectorAll(".suggestion")
  .forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const word =
            button.textContent.trim();

          text +=
            text.length > 0
              ? " " + word
              : word;

          updateText();

        }
      );

    }
  );


/* =========================================
   AI ACTIONS
========================================= */

document
  .querySelectorAll("[data-ai]")
  .forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const action =
            button.dataset.ai;

          if (text.length === 0) {

            alert(
              "Type something first."
            );

            return;
          }


          alert(
            "AI " +
            action +
            " will be connected to the OINANCE AI system."
          );

        }
      );

    }
  );


/* =========================================
   TRANSLATION
========================================= */

const translateAction =
  document.getElementById(
    "translateAction"
  );


translateAction.addEventListener(
  "click",
  function () {

    const language =
      document.getElementById(
        "languageSelect"
      ).value;


    if (text.length === 0) {

      alert(
        "Type something first."
      );

      return;
    }


    alert(
      "Translation to " +
      language +
      " will be connected later."
    );

  }
);


/* =========================================
   CUSTOM BLACK EMOJI GRID
========================================= */

function createCustomEmojiGrid() {

  customEmojiGrid.innerHTML = "";


  /*
    Your image contains approximately:

    5 columns
    6 rows

    The CSS sprite system displays
    each section of the image.
  */

  const columns = 5;

  const rows = 6;


  for (
    let row = 0;
    row < rows;
    row++
  ) {

    for (
      let column = 0;
      column < columns;
      column++
    ) {

      const emoji =
        document.createElement(
          "button"
        );


      emoji.className =
        "custom-emoji";


      const x =
        columns === 1
          ? 0
          : (column / (columns - 1)) * 100;


      const y =
        rows === 1
          ? 0
          : (row / (rows - 1)) * 100;


      emoji.style.backgroundPosition =
        `${x}% ${y}%`;


      emoji.setAttribute(
        "aria-label",
        `Custom black emoji ${row * columns + column + 1}`
      );


      emoji.addEventListener(
        "click",
        function () {

          /*
            For this browser prototype,
            selecting a custom emoji adds
            a black symbol to the message.

            The real Android keyboard will
            eventually use Android's content
            insertion system for custom
            image/sticker content.
          */

          text += " ●";

          updateText();

        }
      );


      customEmojiGrid.appendChild(
        emoji
      );

    }

  }

}


createCustomEmojiGrid();


/* =========================================
   CALCULATOR
========================================= */

const calculatorDisplay =
  document.getElementById(
    "calculatorDisplay"
  );


const calculatorButtons =
  document.querySelectorAll(
    "[data-calc]"
  );


const calculatorClear =
  document.getElementById(
    "calculatorClear"
  );


const calculatorEquals =
  document.getElementById(
    "calculatorEquals"
  );


calculatorButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        if (
          calculatorValue.length >= 25
        ) {
          return;
        }


        calculatorValue +=
          button.dataset.calc;


        calculatorDisplay.textContent =
          calculatorValue;

      }
    );

  }
);


/* =========================================
   SAFE CALCULATOR
========================================= */

function calculateExpression(
  expression
) {

  /*
    Only allow:

    numbers
    decimal points
    + - * /
    spaces
    parentheses
  */

  if (
    !/^[0-9+\-*/().\s]+$/.test(
      expression
    )
  ) {

    throw new Error(
      "Invalid characters"
    );

  }


  /*
    Prevent dangerous repeated
    operators and malformed expressions.
  */

  if (
    /[+\-*/]{3,}/.test(
      expression
    )
  ) {

    throw new Error(
      "Invalid expression"
    );

  }


  /*
    Prototype calculator.

    Function is only reached after
    strict character filtering.
  */

  return Function(
    '"use strict"; return (' +
    expression +
    ')'
  )();

}


/* =========================================
   CALCULATOR CLEAR
========================================= */

calculatorClear.addEventListener(
  "click",
  function () {

    calculatorValue = "";

    calculatorDisplay.textContent =
      "0";

  }
);


/* =========================================
   CALCULATOR EQUALS
========================================= */

calculatorEquals.addEventListener(
  "click",
  function () {

    if (
      calculatorValue.length === 0
    ) {
      return;
    }


    try {

      const result =
        calculateExpression(
          calculatorValue
        );


      if (
        !Number.isFinite(result)
      ) {

        throw new Error(
          "Invalid result"
        );

      }


      calculatorDisplay.textContent =
        result;


      text +=
        text.length > 0
          ? " " + result
          : String(result);


      updateText();


      calculatorValue =
        String(result);

    }

    catch (error) {

      calculatorDisplay.textContent =
        "Error";

      calculatorValue = "";

    }

  }
);


/* =========================================
   GLOBE
========================================= */

document
  .getElementById("globeButton")
  .addEventListener(
    "click",
    function () {

      alert(
        "Language keyboard switching will be added to the Android version."
      );

    }
  );


/* =========================================
   INITIAL STATE
========================================= */

updateText();
