import { ANIMATION_CONSTANTS } from "./constants.js";

const styleSheet = document.createElement("style");
document.head.appendChild(styleSheet);

styleSheet.textContent = ANIMATION_CONSTANTS.KEYFRAMES_CSS;

export const AnimationModule = {
  getAnimationNames() {
    return ANIMATION_CONSTANTS.KEYFRAME_NAMES;
  },

  isValidAnimation(name) {
    return this.getAnimationNames().includes(name.toLowerCase());
  },

  getKeyframeDefinitions() {
    return ANIMATION_CONSTANTS.KEYFRAMES_CSS;
  },
};

export default AnimationModule;
