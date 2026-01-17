import { ANIMATION_CONSTANTS } from "./constants.js";

const styleSheet = document.createElement("style");
document.head.appendChild(styleSheet);

styleSheet.textContent = ANIMATION_CONSTANTS.KEYFRAMES_CSS;
