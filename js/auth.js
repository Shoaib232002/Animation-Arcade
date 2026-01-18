import {
  TABS,
  MESSAGE_TYPES,
  MESSAGES,
  ROUTES,
  UI_DELAYS,
} from "./constants.js";
import { VALIDATION_MSGS } from "./auth/constants.js";
import { AuthUI } from "./auth/ui.js";
import { AuthService } from "./auth/service.js";
import {
  validateName,
  validatePassword,
  validateMatch,
} from "./auth/validation.js";

class AuthManagerClass {
  constructor() {
    this.currentTab = TABS.LOGIN;
    this.ui = new AuthUI();
  }

  bootstrap() {
    const applySession = () => {
      if (!document.body) {
        requestAnimationFrame(applySession);
        return;
      }

      const authData = AuthService.getStoredAuth();
      if (authData) {
        this.ui.updateUIForLoggedIn(authData.name);
      }
    };

    applySession();
  }

  init() {
    this.ui.init();

    // Check if main buttons exist before attaching
    if (!document.getElementById("loginBtn")) return;

    this.attachEventListeners();
    this.attachFieldListeners();
  }

  attachFieldListeners() {
    ["email", "password", "name", "confirmPassword"].forEach((id) => {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener("focus", () => {
          if (field.classList.contains("input-error")) {
            const group = field.closest(".form-group");
            if (group) group.classList.add("show-tooltip");
          }
        });
        field.addEventListener("blur", () => {
          const group = field.closest(".form-group");
          if (group) group.classList.remove("show-tooltip");
        });
      }
    });
  }

  attachEventListeners() {
    // Login Button
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn)
      loginBtn.addEventListener("click", () => this.handleLoginButtonClick());

    // Close Button
    const closeBtn = document.getElementById("closeModal");
    if (closeBtn)
      closeBtn.addEventListener("click", () => this.ui.closeModal());

    // Tab Buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.switchTab(e.target.dataset.tab)
      );
    });

    // Form Submit
    const authForm = document.getElementById("authForm");
    if (authForm)
      authForm.addEventListener("submit", (e) => this.handleSubmit(e));

    // Start Game
    const startGameBtn = document.getElementById("startGameBtn");
    if (startGameBtn)
      startGameBtn.addEventListener("click", () => this.handleStartGame());
  }

  switchTab(tab) {
    this.currentTab = tab;
    this.ui.updateTabButtons(tab);
    this.ui.updateModalContent(tab);
    this.ui.updateFormFields(tab);
    this.ui.resetFormFields();

    const link = document.getElementById("footerActionLink");
    if (link) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.switchTab(tab === TABS.SIGNUP ? TABS.LOGIN : TABS.SIGNUP);
      });
    }
  }

  handleLoginButtonClick() {
    const authData = AuthService.getStoredAuth();
    if (authData) {
      if (confirm(MESSAGES.LOGOUT_CONFIRM)) {
        AuthService.logout();
        this.ui.updateUIForLoggedOut();
      }
    } else {
      this.ui.openModal();
      this.switchTab(TABS.LOGIN);
    }
  }

  handleStartGame() {
    const authData = AuthService.getStoredAuth();
    if (!authData) {
      this.ui.openModal();
      setTimeout(() => {
        const emailField = document.getElementById("email");
        if (emailField) {
          this.ui.setFieldError("email", MESSAGES.LOGIN_REQUIRED);
          emailField.focus();
        }
      }, UI_DELAYS.TOOLTIP_FOCUS);
    } else {
      window.location.href = ROUTES.GAME;
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (this.currentTab === TABS.SIGNUP) {
      this.handleSignupSubmit(email, password);
    } else {
      this.handleLoginSubmit(email, password);
    }
  }

  handleSignupSubmit(email, password) {
    const name = document.getElementById("name").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    if (!name || !email || !password || !confirmPassword) {
      this.ui.showMessage(MESSAGES.FILL_REQUIRED, MESSAGE_TYPES.ERROR);
      this.ui.applyFieldErrors({
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });
      return;
    }

    const nameError = validateName(name);
    if (nameError) {
      this.ui.setFieldError("name", nameError);
      return;
    }

    const passError = validatePassword(password);
    if (passError) {
      this.ui.setFieldError("password", passError);
      return;
    }

    const matchError = validateMatch(password, confirmPassword);
    if (matchError) {
      this.ui.setFieldError("confirmPassword", matchError);
      return;
    }

    if (AuthService.checkEmailExists(email)) {
      this.ui.setFieldError("email", MESSAGES.DUPLICATE_EMAIL);
      return;
    }

    const newUser = AuthService.registerUser(name, email, password);
    this.ui.updateUIForLoggedIn(newUser.name);
    this.ui.closeModal();
  }

  handleLoginSubmit(email, password) {
    if (!email || !password) {
      this.ui.showMessage(MESSAGES.FILL_REQUIRED, MESSAGE_TYPES.ERROR);
      this.ui.applyFieldErrors({
        email: email,
        password: password,
      });
      return;
    }

    const result = AuthService.loginUser(email, password);
    if (!result.success) {
      if (result.error === "EMAIL_NOT_FOUND") {
        this.ui.setFieldError("email", VALIDATION_MSGS.EMAIL_NOT_FOUND);
      } else {
        this.ui.setFieldError("password", VALIDATION_MSGS.INCORRECT_PASSWORD);
      }
      return;
    }

    this.ui.updateUIForLoggedIn(result.user.name);
    this.ui.closeModal();
    this.ui.resetFormFields();
  }
}

export const AuthManager = new AuthManagerClass();
window.AuthManager = AuthManager;

AuthManager.bootstrap();

document.addEventListener("DOMContentLoaded", () => {
  AuthManager.init();
});
