import { STORAGE_KEYS } from "../constants.js";

export class AuthService {
  static getStoredAuth() {
    try {
      const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
      return authData ? JSON.parse(authData) : null;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      return null;
    }
  }

  static getStoredUsers() {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  static saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static saveAuth(user) {
    const authData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
  }

  static logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }

  static createUser(name, email, password) {
    return {
      id: Date.now().toString(),
      name,
      email,
      password,
    };
  }

  static findUser(email) {
    const users = this.getStoredUsers();
    return users.find((u) => u.email === email);
  }

  static checkEmailExists(email) {
    const users = this.getStoredUsers();
    return users.some((u) => u.email === email);
  }

  static registerUser(name, email, password) {
    const users = this.getStoredUsers();
    const newUser = this.createUser(name, email, password);
    users.push(newUser);
    this.saveUsers(users);
    this.saveAuth(newUser);
    return newUser;
  }

  static loginUser(email, password) {
    const user = this.findUser(email);
    if (!user) return { success: false, error: "EMAIL_NOT_FOUND" };
    if (user.password !== password)
      return { success: false, error: "INCORRECT_PASSWORD" };

    this.saveAuth(user);
    return { success: true, user };
  }
}
