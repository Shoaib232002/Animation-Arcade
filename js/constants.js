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
  NO_ACCOUNT: "No account found with this email",
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
};

export const RETRY_LIMITS = {
  UI_UPDATE: 100,
  MAX_FRAME_ATTEMPTS: 100,
};

export const ROUTES = {
  GAME: "/game.html",
};
export const TOTAL_LEVELS = 10;

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
  KEYFRAMES_CSS: `
  @keyframes bounce {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-30px);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes slide {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(150px);
    }
  }

  @keyframes wobble {
    0% {
      transform: rotate(-5deg);
    }
    50% {
      transform: rotate(5deg);
    }
    100% {
      transform: rotate(-5deg);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes complex {
    0% {
      transform: rotate(0deg) scale(1);
      opacity: 1;
    }
    25% {
      transform: rotate(90deg) scale(1.2);
      opacity: 0.9;
    }
    50% {
      transform: rotate(180deg) scale(0.8);
      opacity: 0.7;
    }
    75% {
      transform: rotate(270deg) scale(1.2);
      opacity: 0.9;
    }
    100% {
      transform: rotate(360deg) scale(1);
      opacity: 1;
    }
  }

  @keyframes master {
    0% {
      transform: translateX(0) translateY(0) rotate(0deg);
      opacity: 0.85;
    }
    25% {
      transform: translateX(50px) translateY(-20px) rotate(45deg);
      opacity: 0.9;
    }
    50% {
      transform: translateX(100px) translateY(0) rotate(90deg);
      opacity: 0.85;
    }
    75% {
      transform: translateX(50px) translateY(20px) rotate(180deg);
      opacity: 0.9;
    }
    100% {
      transform: translateX(0) translateY(0) rotate(360deg);
      opacity: 0.85;
    }
  }
`,
};
