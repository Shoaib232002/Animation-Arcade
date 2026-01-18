import { VALIDATION_MSGS } from "./constants.js";

export const validateName = (name) => {
  if (!/^(?=.*[a-zA-Z]{3})[a-zA-Z0-9\s]+$/.test(name)) {
    return VALIDATION_MSGS.NAME_REQUIREMENTS;
  }
  return null;
};

export const validatePassword = (password) => {
  if (
    !/^(?=.*[a-zA-Z]{4,})(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?!.*\s).{4,}$/.test(
      password
    )
  ) {
    return VALIDATION_MSGS.PASSWORD_REQUIREMENTS;
  }
  return null;
};

export const validateMatch = (val1, val2) => {
  if (val1 !== val2) {
    return VALIDATION_MSGS.PASSWORDS_MISMATCH;
  }
  return null;
};
