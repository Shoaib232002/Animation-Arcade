export const THEME_KEY = "animation_arcade_theme";
export const DARK_THEME = "dark";
export const LIGHT_THEME = "light";

export const STORAGE_KEYS = {
  AUTH: "animation_arcade_auth",
  USERS: "animation_arcade_users",
  THEME: THEME_KEY,
};

export const TABS = {
  LOGIN: "login",
  SIGNUP: "signup",
};

export const MESSAGE_TYPES = {
  ERROR: "error",
  SUCCESS: "success",
  INFO: "info",
};

export const MESSAGES = {
  FILL_REQUIRED: "Please fill in all required fields",
  PASSWORD_MISMATCH: "Passwords do not match",
  DUPLICATE_EMAIL: "An account with this email already exists",
  NO_ACCOUNT: "Incorrect email or password",
  INCORRECT_PASSWORD: "Incorrect password",
  LOGIN_REQUIRED: "Please login or sign up to start playing!",
  LOGOUT_CONFIRM: "Are you sure you want to logout?",
};

export const CSS_TRANSITION_DURATION = 300;
export const CSS_ANIMATION_DURATION = 300;

export const UI_DELAYS = {
  TAB_SWITCH: CSS_TRANSITION_DURATION,
  MODAL_CLOSE: CSS_TRANSITION_DURATION,
  FORM_SUBMIT: CSS_TRANSITION_DURATION,
  LOGOUT: CSS_TRANSITION_DURATION * 7,
  SIGNUP_COMPLETE: CSS_TRANSITION_DURATION * 4,
  LOGIN_COMPLETE: CSS_TRANSITION_DURATION * 3.5,
  TOOLTIP_FOCUS: 300,
  WELCOME_MESSAGE: 2000,
  TOOLTIP_AUTO_HIDE: 4000,
};

export const RETRY_LIMITS = {
  UI_UPDATE: 100,
  MAX_FRAME_ATTEMPTS: 100,
};

export const ROUTES = {
  GAME: "/game.html",
};
export const TOTAL_LEVELS = 15;

export const HINT_CONSTANTS = {
  FIRST_TOPIC_INDEX: 0,
  CLASSES: {
    KEYWORD: "hint-keyword",
    SOLUTION_BTN: "show-solution-btn",
    REVEALED: "revealed",
  },
  ATTRIBUTES: {
    VALUES: "data-values",
    HINT: "data-hint",
  },
  MESSAGES: {
    CONFIRM_SOLUTION: "Do you really want to check the solution?",
  },
};

export const UI_STRINGS = {
  SHOW_SOLUTION: "Show Hints",
  SUCCESS: "Success!",
  NEXT: "Next",
  COMPLETION_TITLE: "You've completed all levels!",
  ERROR_TITLE: "Error Loading Game",
  ERROR_MESSAGE_1: "Please check that all files are loaded correctly.",
  ERROR_MESSAGE_2: "Check browser console for details.",
  FAILED_TO_LOAD_LEVELS: "Failed to load levels",
  ERROR_LOADING_LEVELS: "Error loading levels data:",
  FAILED_TO_INITIALIZE: "Failed to initialize game:",
};

export const ANIMATION_CONSTANTS = {
  KEYFRAME_NAMES: [
    "bounce",
    "spin",
    "slide",
    "wobble",
    "pulse",
    "complex",
    "master",
  ],
  KEYFRAMES_CSS: "",
};

export const EDITOR_CONSTANTS = {
  LINE_NUMBER_START: 1,
  LINE_INCREMENT: 1,
  FOCUS_DELAY: 100,
  FIRST_INPUT_INDEX: 0,
  LEVEL_START: 0,
  NAVIGATION: {
    BACKWARD: -1,
    FORWARD: 1,
  },
  BLANK_PLACEHOLDER: "_____",
  FIRST_LEVEL_ID: 1,
  KEYS: {
    ENTER: "Enter",
  },
};

export const SELECTORS = {
  LEVEL_TITLE: ".level-title",
  DESCRIPTION: ".game-description",
  CODE_CONTENT: "#codeContent",
  LINE_NUMBERS: "#lineNumbers",
  HINTS_LIST: "#hintsList",
  CURRENT_LEVEL: "#currentLevel",
  TOTAL_LEVELS: "#totalLevels",
  SUBMIT_BTN: ".submit-btn",
  OUTPUT_BOX: ".output-box",
  PREV_ARROW: "#prevArrow",
  NEXT_ARROW: "#nextArrow",
  BALL: ".ball",
  GROUND: ".ground",
};

export const EDITOR_CSS_CLASSES = {
  CODE_LINE: "code-line",
  CODE_LINE_TEXT: "code-line-text",
  CODE_LINE_BLANK: "code-line-blank",
  BLANK_INPUT: "blank-input",
  CORRECT: "correct",
  ERROR: "error",
  COMPLETION_CONTAINER: "completion-container",
  ERROR_CONTAINER: "error-container",
};

export const getHTMLTemplates = () => ({
  OUTPUT_BOX: `
    <div class="${EDITOR_CSS_CLASSES.GROUND}">
      <div class="stadium-lights"></div>
      <div class="${SELECTORS.BALL.slice(1)}"></div>
    </div>
  `,
  COMPLETION_MESSAGE: `
    <div class="${EDITOR_CSS_CLASSES.COMPLETION_CONTAINER}">
      <div class="confetti"></div>
      <h2>${UI_STRINGS.COMPLETION_TITLE}</h2>
    </div>
  `,
  ERROR_MESSAGE: `
    <div class="${EDITOR_CSS_CLASSES.ERROR_CONTAINER}">
      <h3>${UI_STRINGS.ERROR_TITLE}</h3>
      <p>${UI_STRINGS.ERROR_MESSAGE_1}</p>
      <p>${UI_STRINGS.ERROR_MESSAGE_2}</p>
    </div>
  `,
});

export const VALIDATOR_CONSTANTS = {
  DELAYS: {
    SUCCESS_MESSAGE: 2000,
  },
  NAVIGATION: {
    NEXT_LEVEL: 1,
  },
};
