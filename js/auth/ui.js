import { UI_DELAYS, TABS, RETRY_LIMITS } from "../constants.js";

export class AuthUI {
  constructor() {
    this.overlay = null;
    this.loginBtn = null;
  }

  init() {
    this.overlay = document.getElementById("loginOverlay");
    this.loginBtn = document.getElementById("loginBtn");
  }

  openModal() {
    if (this.overlay) {
      this.overlay.style.display = "flex";
      this.overlay.classList.add("modal-open");
    }
  }

  closeModal() {
    if (this.overlay) {
      this.overlay.style.display = "none";
      this.overlay.classList.remove("modal-open");
    }
    this.clearMessages();
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
    }
  }

  updateFormFields(tab) {
    const nameGroup = document.getElementById("nameGroup");
    const confirmGroup = document.getElementById("confirmPasswordGroup");
    const displayValue = tab === TABS.SIGNUP ? "block" : "none";

    if (nameGroup) nameGroup.style.display = displayValue;
    if (confirmGroup) confirmGroup.style.display = displayValue;
  }

  updateTabButtons(tab) {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
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

  updateUIForLoggedIn(name, retryCount = 0) {
    if (retryCount > RETRY_LIMITS.UI_UPDATE) return;

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

  showNavbarWelcome(name) {
    const existingMsg = document.querySelector(".nav-welcome-message");
    if (existingMsg) existingMsg.remove();

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
}
