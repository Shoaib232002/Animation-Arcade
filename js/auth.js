import {
  STORAGE_KEYS,
  TABS,
  MESSAGE_TYPES,
  MESSAGES,
  RETRY_LIMITS,
  ROUTES,
  UI_DELAYS,
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
      setTimeout(() => {
        const emailField = document.getElementById("email");
        if (emailField) {
          this.setFieldError(
            "email",
            "Please login or sign up to start playing!"
          );
          emailField.focus();
        }
      }, UI_DELAYS.TOOLTIP_FOCUS);
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
    this.resetFormFields();
    this.switchTab(TABS.LOGIN);
  }

  closeModal() {
    if (this.overlay) {
      this.overlay.style.display = "none";
      this.overlay.classList.remove("modal-open");
    }
    this.clearMessages();
    this.resetFormFields();
  }

  switchTab(tab) {
    this.currentTab = tab;

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    this.updateModalContent(tab);
    this.updateFormFields(tab);
    this.resetFormFields();
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
      const actionText = isSignup ? "Already have an account?" : "New user?";
      const actionLink = isSignup ? "Login" : "Sign up";
      footerText.innerHTML = `<span id="footerActionText">${actionText}</span> <a href="#" id="footerActionLink">${actionLink}</a>.`;
      const link = document.getElementById("footerActionLink");
      if (link) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          this.switchTab(isSignup ? TABS.LOGIN : TABS.SIGNUP);
        });
      }
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
      this.applyFieldErrors({ name, email, password, confirmPassword });
      return;
    }

    const usernameRegex = /^(?=.*[a-zA-Z]{3})[a-zA-Z0-9\s]+$/;
    if (!usernameRegex.test(name)) {
      this.setFieldError("name", "Name must have at least 3 letters");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-zA-Z]{4,})(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?!.*\s).{4,}$/;
    if (!passwordRegex.test(password)) {
      this.setFieldError(
        "password",
        "4+ letters, 1 number, 1 special char, no spaces"
      );
      return;
    }

    if (password !== confirmPassword) {
      this.setFieldError("confirmPassword", "Passwords do not match");
      return;
    }

    this.signup(name, email, password);
  }

  handleLoginSubmit(email, password) {
    if (!email || !password) {
      this.showMessage(MESSAGES.FILL_REQUIRED, MESSAGE_TYPES.ERROR);
      this.applyFieldErrors({ email, password });
      return;
    }

    this.login(email, password);
  }

  signup(name, email, password) {
    const users = this.getStoredUsers();

    if (users.some((u) => u.email === email)) {
      this.setFieldError("email", MESSAGES.DUPLICATE_EMAIL);
      return;
    }

    const user = this.createUser(name, email, password);
    users.push(user);
    this.saveUsers(users);
    this.saveAuth(user);

    this.updateUIForLoggedIn(name);
    this.closeModal();
  }

  login(email, password) {
    const users = this.getStoredUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      this.setFieldError("email", "No account found with this email");
      return;
    }

    if (user.password !== password) {
      this.setFieldError("password", "Incorrect password");
      return;
    }

    this.saveAuth(user);
    this.updateUIForLoggedIn(user.name);
    this.closeModal();
    this.resetFormFields();
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

    this.showNavbarWelcome(name);
  }

  showNavbarWelcome(name) {
    const existingMsg = document.querySelector(".nav-welcome-message");
    if (existingMsg) {
      existingMsg.remove();
    }

    const welcomeMsg = document.createElement("span");
    welcomeMsg.className = "nav-welcome-message";
    welcomeMsg.textContent = `Welcome, ${name}!`;

    const navActions = document.querySelector(".nav-actions");
    if (navActions) {
      navActions.prepend(welcomeMsg);

      setTimeout(() => {
        if (welcomeMsg && welcomeMsg.parentNode) {
          welcomeMsg.remove();
        }
      }, UI_DELAYS.WELCOME_MESSAGE);
    }
  }

  updateUIForLoggedOut() {
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      loginBtn.textContent = "Login";
    }

    const welcomeMsg = document.querySelector(".nav-welcome-message");
    if (welcomeMsg) {
      welcomeMsg.remove();
    }
  }

  showMessage(message, type) {
    const msgDiv = document.getElementById("authMessage");
    if (msgDiv) {
      msgDiv.textContent = message;
      msgDiv.className = `auth-message ${type}`;
      msgDiv.style.display = "block";
    }
  }

  clearMessages() {
    const msgDiv = document.getElementById("authMessage");
    if (msgDiv) {
      msgDiv.textContent = "";
      msgDiv.style.display = "none";
      msgDiv.className = "auth-message";
    }
  }

  setFieldError(fieldId, tip) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const formGroup = field.closest(".form-group");
    if (!formGroup) return;

    field.classList.add("input-error");
    formGroup.setAttribute("data-tooltip", tip || "");
    formGroup.classList.add("show-tooltip");

    setTimeout(() => {
      formGroup.classList.remove("show-tooltip");
    }, UI_DELAYS.TOOLTIP_AUTO_HIDE);

    field.addEventListener("focus", () => {
      if (field.classList.contains("input-error")) {
        formGroup.classList.add("show-tooltip");
      }
    });

    field.addEventListener("blur", () => {
      formGroup.classList.remove("show-tooltip");
    });
  }

  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const formGroup = field.closest(".form-group");
    if (formGroup) {
      formGroup.removeAttribute("data-tooltip");
      formGroup.classList.remove("show-tooltip");
    }

    field.classList.remove("input-error");
  }

  applyFieldErrors(fields) {
    Object.entries(fields).forEach(([id, value]) => {
      if (!value) {
        this.setFieldError(id, "This field is required");
      } else {
        this.clearFieldError(id);
      }
    });
  }

  resetFormFields() {
    ["name", "email", "password", "confirmPassword"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.value = "";
        this.clearFieldError(id);
      }
    });
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
