const createLevel = (
  id,
  title,
  description,
  code,
  blanks,
  answer,
  keyword,
  topicDescription,
  question,
  expectedCSS
) => ({
  id,
  title,
  description,
  code,
  blanks,
  hints: [{ term: "Show Solution", description: answer }],
  keyword,
  topicHints: [{ keyword, description: topicDescription }],
  question,
  expectedCSS,
});

export const levels = [
  createLevel(
    1,
    "Level 1: Basic Transform - Translation",
    "Welcome to Animation Arcade! In this level, you'll learn about the transform property with translateX(). The transform property allows you to move, rotate, scale, and skew elements. The translateX() function moves an element horizontally. Use positive values to move right and negative values to move left. For example: translateX(100px) moves the element 100 pixels to the right.",
    [".ball {", "  transform: _____;", "}"],
    [{ line: 1, answer: "translateX(200px)" }],
    "translateX(200px)",
    "transform",
    "Values: translateX(), translateY(), translate(), rotate(), scale(), skew(). Use units like px for translate and deg for rotate.",
    "Can you move the ball 200px to the right using the transform property?",
    "transform: translateX(200px);"
  ),

  createLevel(
    2,
    "Level 2: Transform - Rotation",
    "Now let's rotate elements! The rotate() function spins an element around its center point. You specify the angle in degrees (deg). Positive values rotate clockwise, negative values rotate counter-clockwise. For example: rotate(45deg) rotates the element 45 degrees clockwise.",
    [".ball {", "  transform: _____;", "}"],
    [{ line: 1, answer: "rotate(45deg)" }],
    "rotate(45deg)",
    "transform",
    "Syntax: rotate(angle). Use deg for degrees. Example: rotate(90deg) for a quarter turn.",
    "Can you rotate the ball 45 degrees clockwise?",
    "transform: rotate(45deg);"
  ),

  createLevel(
    3,
    "Level 3: Transform - Scaling",
    "The scale() function changes the size of an element. A value of 1 keeps the original size, values greater than 1 make it larger, and values less than 1 make it smaller. You can scale uniformly (scale(2)) or differently on each axis (scale(2, 0.5)).",
    [".ball {", "  transform: _____;", "}"],
    [{ line: 1, answer: "scale(1.5)" }],
    "scale(1.5)",
    "transform",
    "Syntax: scale(x) or scale(x, y). Values greater than 1 enlarge, values less than 1 shrink. Example: scale(2) doubles the size.",
    "Can you make the ball 1.5 times larger using scale?",
    "transform: scale(1.5);"
  ),

  createLevel(
    4,
    "Level 4: Multiple Transforms",
    "You can combine multiple transform functions in a single declaration! Simply separate them with spaces. The transforms are applied in the order you write them, which can affect the final result. For example: transform: translateX(100px) rotate(45deg) scale(1.5);",
    [".ball {", "  transform: _____ _____;", "}"],
    [{ line: 1, answer: "translateX(150px) scale(2)" }],
    "translateX(150px) scale(2)",
    "transform",
    "Combine transforms with spaces. Order matters! Example: translateX(50px) rotate(30deg) applies translation first, then rotation.",
    "Move the ball 150px right and scale it to double size?",
    "transform: translateX(150px) scale(2);"
  ),

  createLevel(
    5,
    "Level 5: Complex Multi-Transform",
    "When combining three or more transforms, understanding execution order becomes critical. Each function applies to the result of the previous one. Experiment with different orderings to see how translateX(100px) rotate(90deg) scale(0.8) differs from scale(0.8) rotate(90deg) translateX(100px).",
    [".ball {", "  transform: _____ _____ _____;", "}"],
    [{ line: 1, answer: "translateX(120px) rotate(180deg) scale(1.8)" }],
    "translateX(120px) rotate(180deg) scale(1.8)",
    "transform",
    "Multiple transforms execute left to right. Each affects the coordinate system for the next. Example: translate then rotate vs rotate then translate produces different results.",
    "Move the ball 120px right, rotate it 180 degrees, and scale to 1.8 times?",
    "transform: translateX(120px) rotate(180deg) scale(1.8);"
  ),

  createLevel(
    6,
    "Level 6: Basic Transition",
    "Transitions make changes smooth instead of instant. The transition property defines how property changes should be animated. The basic syntax is: transition: property duration. For example: transition: transform 2s makes transform changes animate over 2 seconds.",
    [".ball {", "  transform: translateX(200px);", "  transition: _____;", "}"],
    [{ line: 2, answer: "transform 2s" }],
    "transform 2s",
    "transition",
    "Syntax: transition: property duration. Duration uses s (seconds) or ms (milliseconds). Example: transition: all 0.5s.",
    "Add a 2-second transition to make the transform change smoothly?",
    "transform: translateX(200px); transition: transform 2s;"
  ),

  createLevel(
    7,
    "Level 7: Transition with Timing Function",
    "Timing functions control the speed curve of transitions. Common values include: linear (constant speed), ease (slow start and end), ease-in (slow start), ease-out (slow end), and ease-in-out (slow start and end). The syntax is: transition: property duration timing-function.",
    [".ball {", "  transform: translateX(200px);", "  transition: _____;", "}"],
    [{ line: 2, answer: "transform 1.5s ease-in-out" }],
    "transform 1.5s ease-in-out",
    "transition",
    "Values: linear, ease, ease-in, ease-out, ease-in-out. Example: transition: opacity 1s ease-in.",
    "Create a 1.5-second transition with ease-in-out timing for the transform?",
    "transform: translateX(200px); transition: transform 1.5s ease-in-out;"
  ),

  createLevel(
    8,
    "Level 8: Multi-Property Transitions",
    "You can transition multiple properties simultaneously by separating them with commas. Each property can have its own duration and timing function. This creates coordinated animations where different aspects change at different speeds.",
    [
      ".ball {",
      "  transform: translateX(180px) scale(1.6);",
      "  opacity: 0.7;",
      "  transition: _____, _____;",
      "}",
    ],
    [{ line: 3, answer: "transform 2s ease-out, opacity 1s linear" }],
    "transform 2s ease-out, opacity 1s linear",
    "transition",
    "Syntax: transition: prop1 duration timing, prop2 duration timing. Each property can have independent timing. Example: transition: width 1s ease, height 2s ease-in.",
    "Transition the transform over 2 seconds with ease-out and opacity over 1 second with linear timing?",
    "transform: translateX(180px) scale(1.6); opacity: 0.7; transition: transform 2s ease-out, opacity 1s linear;"
  ),

  createLevel(
    9,
    "Level 9: Basic Animation Setup",
    "CSS animations use keyframes to define animation sequences. First, we set up the animation properties on the element. The animation-name connects to a keyframe rule, and animation-duration sets how long the animation takes. Example: animation: slideBounce 3s means use the 'slideBounce' keyframes for 3 seconds.",
    [".ball {", "  animation: _____ _____;", "}"],
    [{ line: 1, answer: "bounce 2s" }],
    "bounce 2s",
    "animation",
    "Syntax: animation: name duration. The name must match a keyframes rule. Example: animation: slide 3s.",
    "Set up an animation named 'bounce' that runs for 2 seconds?",
    "animation: bounce 2s;"
  ),

  createLevel(
    10,
    "Level 10: Animation with Iteration",
    "Animations can repeat multiple times or infinitely. Use animation-iteration-count to control this. You can specify a number (like 3) or use 'infinite' for endless repetition. Combine it with other properties: animation: name duration iteration-count.",
    [".ball {", "  animation: _____ _____ _____;", "}"],
    [{ line: 1, answer: "spin 1s infinite" }],
    "spin 1s infinite",
    "animation",
    "Values: number or infinite. Example: animation: pulse 2s 3 runs 3 times, animation: rotate 1s infinite loops forever.",
    "Create an animation named 'spin' that runs for 1 second and repeats infinitely?",
    "animation: spin 1s infinite;"
  ),

  createLevel(
    11,
    "Level 11: Animation Direction",
    "Control the direction of your animation with animation-direction. Values include: normal (forward), reverse (backward), alternate (forward then backward), and alternate-reverse (backward then forward). This is especially useful with infinite animations to create smooth back-and-forth effects.",
    [".ball {", "  animation: _____ _____ _____ _____;", "}"],
    [{ line: 1, answer: "slide 2s infinite alternate" }],
    "slide 2s infinite alternate",
    "animation",
    "Values: normal, reverse, alternate, alternate-reverse. Example: animation: bounce 1s infinite alternate creates a ping-pong effect.",
    "Create a 'slide' animation that runs for 2 seconds, repeats infinitely, and alternates direction?",
    "animation: slide 2s infinite alternate;"
  ),

  createLevel(
    12,
    "Level 12: Animation Timing Function",
    "Just like transitions, animations can use timing functions to control their speed curve. The timing function affects how the animation progresses between keyframes. You can use the same values: linear, ease, ease-in, ease-out, ease-in-out, or even cubic-bezier for custom curves.",
    [".ball {", "  animation: _____ _____ _____ _____ _____;", "}"],
    [{ line: 1, answer: "wobble 1.8s ease-in-out infinite alternate" }],
    "wobble 1.8s ease-in-out infinite alternate",
    "animation",
    "Timing functions: linear, ease, ease-in, ease-out, ease-in-out. Example: animation: fade 2s ease-in infinite creates smooth acceleration.",
    "Create a 'wobble' animation with 1.8s duration, ease-in-out timing, infinite repetition, and alternate direction?",
    "animation: wobble 1.8s ease-in-out infinite alternate;"
  ),

  createLevel(
    13,
    "Level 13: Animation Delay",
    "Animation delay creates a pause before the animation starts. This is useful for sequencing multiple animations or creating staggered effects. The delay comes after the duration in the shorthand syntax: animation: name duration timing-function delay.",
    [".ball {", "  animation: _____ _____ _____ _____ _____ _____;", "}"],
    [{ line: 1, answer: "pulse 2s ease-in 0.5s infinite alternate" }],
    "pulse 2s ease-in 0.5s infinite alternate",
    "animation",
    "Delay syntax: animation: name duration timing delay iteration direction. Delay can be in seconds or milliseconds. Example: animation: fade 1s ease 2s waits 2 seconds before starting.",
    "Create a 'pulse' animation with 2s duration, ease-in timing, 0.5s delay, infinite iterations, and alternate direction?",
    "animation: pulse 2s ease-in 0.5s infinite alternate;"
  ),

  createLevel(
    14,
    "Level 14: Complex Multi-Line Animation",
    "Advanced animations often require multiple properties working together. You can animate transforms while also changing other properties like opacity or background. Each property can have different timing and iteration patterns to create rich, layered effects.",
    [
      ".ball {",
      "  animation: _____ _____ _____ _____ _____;",
      "  transform: rotate(0deg);",
      "  opacity: 1;",
      "}",
    ],
    [{ line: 1, answer: "complex 3s ease-in-out 0.3s infinite alternate" }],
    "complex 3s ease-in-out 0.3s infinite alternate",
    "animation",
    "Complex animations combine multiple properties with precise timing. Use animation shorthand for the main effect and additional properties for layered control.",
    "Create a 'complex' animation with 3s duration, ease-in-out timing, 0.3s delay, infinite iterations, and alternate direction?",
    "animation: complex 3s ease-in-out 0.3s infinite alternate; transform: rotate(0deg); opacity: 1;"
  ),

  createLevel(
    15,
    "Level 15: Master Level - Combined Animation and Transform",
    "The ultimate challenge combines everything: multiple transform functions with complex animation properties. You need to coordinate transform positioning with animation timing, iteration, direction, and delays. This creates sophisticated animations that demonstrate complete mastery of CSS animation techniques.",
    [
      ".ball {",
      "  transform: _____ _____ _____;",
      "  animation: _____ _____ _____ _____ _____ _____;",
      "  opacity: 0.85;",
      "}",
    ],
    [
      { line: 1, answer: "translateX(100px) rotate(45deg) scale(1.4)" },
      { line: 2, answer: "master 2.5s ease-in-out 0.2s infinite alternate" },
    ],
    "translateX(100px) rotate(45deg) scale(1.4) AND master 2.5s ease-in-out 0.2s infinite alternate",
    "animation",
    "Master level combines static transforms with animated properties. The transform provides base positioning while animation adds dynamic movement. Coordinate both for professional results.",
    "Apply a transform that moves 100px right, rotates 45deg, and scales to 1.4, then add a 'master' animation with 2.5s duration, ease-in-out timing, 0.2s delay, infinite iterations, and alternate direction?",
    "transform: translateX(100px) rotate(45deg) scale(1.4); animation: master 2.5s ease-in-out 0.2s infinite alternate; opacity: 0.85;"
  ),
];
