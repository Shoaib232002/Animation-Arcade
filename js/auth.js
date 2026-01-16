import {
  STORAGE_KEYS,
  TABS,
  MESSAGE_TYPES,
  MESSAGES,
  RETRY_LIMITS,
  ROUTES,
} from "./constants.js";

class AuthManagerClass {
  constructor() {
    this.currentTab = TABS.LOGIN;
    this.modal = null;
    this.overlay = null;
    this.loginBtn = null;
  }

  bootstrap() {
    const applySession = () => {
      if (!document.body) {
        requestAnimationFrame(applySession);
        return;
      }

      const authData = this.getStoredAuth();
      if (authData) {
        this.updateUIForLoggedIn(authData.name);
      }
    };

    applySession();
  }

  init() {
    this.modal = document.querySelector(".modal");
    this.overlay = document.getElementById("loginOverlay");
    this.loginBtn = document.getElementById("loginBtn");

    if (!this.loginBtn) {
      return;
    }

    this.attachEventListeners();
  }

  attachEventListeners() {
    this.loginBtn.addEventListener("click", () =>
      this.handleLoginButtonClick()
    );

    const closeBtn = document.getElementById("closeModal");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal());
    }

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.switchTab(e.target.dataset.tab)
      );
    });

    const authForm = document.getElementById("authForm");
    if (authForm) {
      authForm.addEventListener("submit", (e) => this.handleSubmit(e));
    }

    const startGameBtn = document.getElementById("startGameBtn");
    if (startGameBtn) {
      startGameBtn.addEventListener("click", () => this.handleStartGame());
    }
  }

  handleStartGame() {
    const authData = this.getStoredAuth();
    if (!authData) {
      this.openModal();
      this.showMessage(MESSAGES.LOGIN_REQUIRED, MESSAGE_TYPES.ERROR);
    } else {
      window.location.href = ROUTES.GAME;
    }
  }

  handleLoginButtonClick() {
    const authData = this.getStoredAuth();
    if (authData) {
      this.logout();
    } else {
      this.openModal();
    }
  }

  openModal() {
    if (this.overlay) {
      this.overlay.style.display = "flex";
      this.overlay.classList.add("modal-open");
    }
    this.switchTab(TABS.LOGIN);
  }

  closeModal() {
    if (this.overlay) {
      this.overlay.style.display = "none";
      this.overlay.classList.remove("modal-open");
    }
    this.clearMessages();
  }

  switchTab(tab) {
    this.currentTab = tab;

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    this.updateModalContent(tab);
    this.updateFormFields(tab);
    this.clearMessages();
  }

  updateModalContent(tab) {
    const modalTitle = document.getElementById("modal-title");
    const submitBtn = document.getElementById("submitBtn");
    const footerText = document.getElementById("authFooterText");

    const isSignup = tab === TABS.SIGNUP;

    if (modalTitle) {
      modalTitle.textContent = isSignup ? "Sign Up" : "Login";
    }
    if (submitBtn) {
      submitBtn.textContent = isSignup ? "Sign Up" : "Login";
    }
    if (footerText) {
      footerText.textContent = isSignup
        ? "Already have an account? Login."
        : "New user? Sign up.";
    }
  }

  updateFormFields(tab) {
    const nameGroup = document.getElementById("nameGroup");
    const confirmGroup = document.getElementById("confirmPasswordGroup");
    const displayValue = tab === TABS.SIGNUP ? "block" : "none";

    if (nameGroup) {
      nameGroup.style.display = displayValue;
    }
    if (confirmGroup) {
      confirmGroup.style.display = displayValue;
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
      this.showMessage(MESSAGES.FILL_REQUIRED, MESSAGE_TYPES.ERROR);
      return;
    }

    const usernameRegex = /^(?=.*[a-zA-Z]{3})[a-zA-Z0-9\s]+$/;
    if (!usernameRegex.test(name)) {
      this.showMessage(
        "Username must contain only letters, numbers, and spaces, with at least 3 letters (cannot be only numbers)",
        MESSAGE_TYPES.ERROR
      );
      return;
    }

    if (password !== confirmPassword) {
      this.showMessage(MESSAGES.PASSWORD_MISMATCH, MESSAGE_TYPES.ERROR);
      return;
    }

    this.signup(name, email, password);
  }

  handleLoginSubmit(email, password) {
    if (!email || !password) {
      this.showMessage(MESSAGES.FILL_REQUIRED, MESSAGE_TYPES.ERROR);
      return;
    }

    this.login(email, password);
  }

  signup(name, email, password) {
    const users = this.getStoredUsers();

    if (users.some((u) => u.email === email)) {
      this.showMessage(MESSAGES.DUPLICATE_EMAIL, MESSAGE_TYPES.ERROR);
      return;
    }

    const user = this.createUser(name, email, password);
    users.push(user);
    this.saveUsers(users);
    this.saveAuth(user);

    try {
      this.closeModal();
    } catch (e) {
      throw new Error(console.error("Error closing modal:", e));
    }
    this.updateUIForLoggedIn(name);
  }

  login(email, password) {
    const users = this.getStoredUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      this.showMessage(MESSAGES.NO_ACCOUNT, MESSAGE_TYPES.ERROR);
      return;
    }

    if (user.password !== password) {
      this.showMessage(MESSAGES.INCORRECT_PASSWORD, MESSAGE_TYPES.ERROR);
      return;
    }

    this.saveAuth(user);
    try {
      this.closeModal();
    } catch (e) {
      throw new Error(console.error("Error closing modal:", e));
    }
    this.updateUIForLoggedIn(user.name);
  }

  logout() {
    if (confirm(MESSAGES.LOGOUT_CONFIRM)) {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      this.updateUIForLoggedOut();
    }
  }

  updateUIForLoggedIn(name, retryCount = 0) {
    if (retryCount > RETRY_LIMITS.UI_UPDATE) {
      return;
    }

    const loginBtn = document.getElementById("loginBtn");
    if (!loginBtn) {
      requestAnimationFrame(() =>
        this.updateUIForLoggedIn(name, retryCount + 1)
      );
      return;
    }

    loginBtn.textContent = "Logout";

    const heroSection = document.querySelector(".hero-section");
    if (!heroSection) {
      requestAnimationFrame(() =>
        this.updateUIForLoggedIn(name, retryCount + 1)
      );
      return;
    }

    this.createOrUpdateWelcomeMessage(heroSection, name);
  }

  createOrUpdateWelcomeMessage(heroSection, name) {
    let welcomeMsg = document.querySelector(".welcome-message");
    if (!welcomeMsg) {
      welcomeMsg = document.createElement("div");
      welcomeMsg.className = "welcome-message";
      heroSection.prepend(welcomeMsg);
    }
    welcomeMsg.textContent = `Welcome back, ${name}!`;
    welcomeMsg.style.display = "block";
  }

  updateUIForLoggedOut() {
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      loginBtn.textContent = "Login";
    }

    const welcomeMsg = document.querySelector(".welcome-message");
    if (welcomeMsg) {
      welcomeMsg.remove();
    }
  }

  showMessage(message, type) {
    const messageDiv = document.getElementById("authMessage");
    if (messageDiv) {
      messageDiv.textContent = message;
      messageDiv.className = `auth-message ${type}`;
    }
  }

  clearMessages() {
    const messageDiv = document.getElementById("authMessage");
    if (messageDiv) {
      messageDiv.textContent = "";
      messageDiv.className = "auth-message";
    }
  }

  createUser(name, email, password) {
    return {
      id: Date.now().toString(),
      name,
      email,
      password,
    };
  }

  saveAuth(user) {
    const authData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
  }

  getStoredAuth() {
    try {
      const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
      return authData ? JSON.parse(authData) : null;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      return null;
    }
  }

  getStoredUsers() {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
}

export const AuthManager = new AuthManagerClass();
window.AuthManager = AuthManager;

AuthManager.bootstrap();

document.addEventListener("DOMContentLoaded", () => {
  AuthManager.init();
});
