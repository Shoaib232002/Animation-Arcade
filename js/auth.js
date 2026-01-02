class AuthManagerClass {
  constructor() {
    this.currentTab = "login";
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
      
      const authData = localStorage.getItem("animation_arcade_auth");
      if (authData) {
        try {
          const user = JSON.parse(authData);
          this.updateUIForLoggedIn(user.name);
        } catch (e) {
          e.preventDefault();
          localStorage.removeItem("animation_arcade_auth");
        }
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
    
    this.loginBtn.addEventListener("click", () => this.handleLoginButtonClick());
    
    const closeBtn = document.getElementById("closeModal");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal());
    }
    
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => this.switchTab(e.target.dataset.tab));
    });
    
    const authForm = document.getElementById("authForm");
    if (authForm) {
      authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit(e);
      });
    }
    
    const startGameBtn = document.getElementById("startGameBtn");
    if (startGameBtn) {
      startGameBtn.addEventListener("click", () => {
        const authData = localStorage.getItem("animation_arcade_auth");
        if (!authData) {
          this.openModal();
          this.showMessage("Please login or sign up to start playing!", "error");
        } else {
          window.location.href = "/game.html";
        }
      });
    }
  }

  handleLoginButtonClick() {
    const authData = localStorage.getItem("animation_arcade_auth");
    if (authData) {
      this.logout();
    } else {
      this.openModal();
    }
  }

  openModal() {
    this.overlay.style.display = "flex";
    this.switchTab("login");
  }

  closeModal() {
    this.overlay.style.display = "none";
    this.clearMessages();
  }

  switchTab(tab) {
    this.currentTab = tab;
    
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });
    
    this.updateModalContent(tab);
    this.updateFormFields(tab);
    this.clearMessages();
  }

  updateModalContent(tab) {
    const modalTitle = document.getElementById("modalTitle");
    const submitBtn = document.getElementById("submitBtn");
    const footerText = document.getElementById("authFooterText");
    
    const isSignup = tab === "signup";
    
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
    const displayValue = tab === "signup" ? "block" : "none";
    
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
    
    if (this.currentTab === "signup") {
      const name = document.getElementById("name").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
      
      if (!name || !email || !password || !confirmPassword) {
        this.showMessage("Please fill in all required fields", "error");
        return;
      }
      
      if (password !== confirmPassword) {
        this.showMessage("Passwords do not match", "error");
        return;
      }
      
      this.signup(name, email, password);
    } else {
      if (!email || !password) {
        this.showMessage("Please fill in all required fields", "error");
        return;
      }
      
      this.login(email, password);
    }
  }

  signup(name, email, password) {
    const users = JSON.parse(localStorage.getItem("animation_arcade_users") || "[]");
    
    if (users.some(u => u.email === email)) {
      this.showMessage("An account with this email already exists", "error");
      return;
    }
    
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password
    };
    
    users.push(user);
    localStorage.setItem("animation_arcade_users", JSON.stringify(users));
    
    const authData = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem("animation_arcade_auth", JSON.stringify(authData));
    
    this.closeModal();
    this.updateUIForLoggedIn(name);
  }

  login(email, password) {
    const users = JSON.parse(localStorage.getItem("animation_arcade_users") || "[]");
    const user = users.find(u => u.email === email);
    
    if (!user) {
      this.showMessage("No account found with this email", "error");
      return;
    }
    
    if (user.password !== password) {
      this.showMessage("Incorrect password", "error");
      return;
    }
    
    const authData = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem("animation_arcade_auth", JSON.stringify(authData));
    
    this.closeModal();
    this.updateUIForLoggedIn(user.name);
  }

  logout() {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("animation_arcade_auth");
      this.updateUIForLoggedOut();
    }
  }

  updateUIForLoggedIn(name, retryCount = 0) {
    if (retryCount > 100) {
      return;
    }
    
    const loginBtn = document.getElementById("loginBtn");
    if (!loginBtn) {
      requestAnimationFrame(() => this.updateUIForLoggedIn(name, retryCount + 1));
      return;
    }
    
    loginBtn.textContent = "Logout";
    
    const heroSection = document.querySelector(".hero-section");
    if (!heroSection) {
      requestAnimationFrame(() => this.updateUIForLoggedIn(name, retryCount + 1));
      return;
    }
    
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
}

export const AuthManager = new AuthManagerClass();
window.AuthManager = AuthManager;

AuthManager.bootstrap();

document.addEventListener("DOMContentLoaded", () => {
  AuthManager.init();
});