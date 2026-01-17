export class KeyframesManager {
  constructor() {
    this.keyframesCache = {};
  }

  extractKeyframeName(keyframesText) {
    const match = keyframesText.match(/@keyframes\s+(\w+)/);
    return match ? match[1] : "animation";
  }

  cacheKeyframes(keyframeId, keyframesText) {
    this.keyframesCache[keyframeId] = keyframesText;
  }

  setupKeyframeListeners(showCallback, hideCallback) {
    const keyframeHovers = document.querySelectorAll(".keyframe-hover");
    keyframeHovers.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleKeyframeTooltip(e, showCallback, hideCallback);
      });
      element.style.cursor = "pointer";
    });

    document.addEventListener("click", () => {
      hideCallback(null, true);
    });
  }

  toggleKeyframeTooltip(event, showCallback, hideCallback) {
    const element = event.target;

    const existingTooltip = document.querySelector(".keyframe-tooltip");
    if (
      existingTooltip &&
      element.getAttribute("data-tooltip-active") === "true"
    ) {
      hideCallback(null, true);
      return;
    }

    showCallback(event);
  }

  showKeyframeTooltip(event, escapeHtmlFn, hideCallback) {
    const element = event.target;
    const keyframeId = element.getAttribute("data-keyframe-id");
    const keyframesText = this.keyframesCache[keyframeId];

    if (!keyframesText) return;

    hideCallback(null, true);

    const tooltip = document.createElement("div");
    tooltip.className = "keyframe-tooltip";
    tooltip.innerHTML = `<pre><code>${escapeHtmlFn(keyframesText)}</code></pre>`;
    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + "px";
    tooltip.style.top = rect.bottom + 10 + "px";

    element.setAttribute("data-tooltip-active", "true");
  }

  hideKeyframeTooltip(event) {
    const tooltip = document.querySelector(".keyframe-tooltip");
    if (tooltip) {
      tooltip.remove();
    }
    if (event) {
      event.target.removeAttribute("data-tooltip-active");
    } else {
      document
        .querySelectorAll(".keyframe-hover[data-tooltip-active]")
        .forEach((el) => {
          el.removeAttribute("data-tooltip-active");
        });
    }
  }

  createKeyframesHeader(level) {
    if (!level.keyframes) return null;

    const keyframeName = this.extractKeyframeName(level.keyframes);
    const keyframeId = `keyframe-${level.id}`;

    this.cacheKeyframes(keyframeId, level.keyframes);

    const keyframesHeader = document.createElement("div");
    keyframesHeader.className = "keyframes-header";
    keyframesHeader.innerHTML = `<strong>Keyframes:</strong> <span class="keyframe-hover" data-keyframe-id="${keyframeId}" title="Click to see keyframes">${keyframeName}</span>`;

    return keyframesHeader;
  }
}
