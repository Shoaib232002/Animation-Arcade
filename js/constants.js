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
