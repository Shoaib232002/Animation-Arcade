import { jest } from "@jest/globals";

const mockGetLevels = jest.fn();

jest.unstable_mockModule("../js/levelsData.js", () => ({
  getLevels: mockGetLevels,
}));

const { GameValidator } = await import("../js/validator.js");
const { VALIDATOR_CONSTANTS, UI_STRINGS } = await import("../js/constants.js");

describe("GameValidator", () => {
  let validator;
  let mockEditor;
  let mockLevels;

  const createMockLevel = (id, expectedCSS) => ({ id, expectedCSS });

  const createMockButton = () => ({ textContent: "" });

  beforeEach(() => {
    jest.useFakeTimers();

    const firstLevelCSS = "transform: rotate(45deg)";
    const secondLevelCSS = "transform: scale(2)";
    const thirdLevelCSS = "transform: translate(100px)";

    mockLevels = [
      createMockLevel(1, firstLevelCSS),
      createMockLevel(2, secondLevelCSS),
      createMockLevel(3, thirdLevelCSS),
    ];

    mockGetLevels.mockReturnValue(mockLevels);

    mockEditor = {
      currentLevel: 0,
      inputs: [],
      elements: {
        submitBtn: null,
      },
      applyAnimation: jest.fn(),
      loadLevel: jest.fn(),
      showCompletionMessage: jest.fn(),
    };

    validator = new GameValidator(mockEditor);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test("normalizeValue should handle complex CSS with spaces and semicolons", () => {
    const complexInput = "TRANSFORM: ROTATE( 45DEG ) SCALE( 2 );;";
    const expectedOutput = "transform: rotate(45deg)scale(2)";

    expect(validator.normalizeValue(complexInput)).toBe(expectedOutput);
  });

  test("handleSuccess should update button to SUCCESS then call navigation after delay", () => {
    const mockBtn = createMockButton();
    mockEditor.elements.submitBtn = mockBtn;
    const level = mockLevels[0];

    jest.spyOn(validator, "updateSubmitButton");
    jest.spyOn(validator, "navigateToNextLevel");

    validator.handleSuccess(level);

    expect(mockBtn.textContent).toBe(UI_STRINGS.SUCCESS);
    expect(mockEditor.applyAnimation).toHaveBeenCalledWith(level.expectedCSS);

    jest.advanceTimersByTime(VALIDATOR_CONSTANTS.DELAYS.SUCCESS_MESSAGE);

    expect(validator.updateSubmitButton).toHaveBeenCalled();
    expect(validator.navigateToNextLevel).toHaveBeenCalled();
  });

  test("navigateToNextLevel should load next level when more levels exist", () => {
    const firstLevelIndex = 0;
    mockEditor.currentLevel = firstLevelIndex;

    validator.navigateToNextLevel();

    const expectedNextLevel =
      firstLevelIndex + VALIDATOR_CONSTANTS.NAVIGATION.NEXT_LEVEL;
    expect(mockGetLevels).toHaveBeenCalled();
    expect(mockEditor.loadLevel).toHaveBeenCalledWith(expectedNextLevel);
    expect(mockEditor.showCompletionMessage).not.toHaveBeenCalled();
  });

  test("navigateToNextLevel should show completion message at last level", () => {
    const lastLevelIndex = mockLevels.length - 1;
    mockEditor.currentLevel = lastLevelIndex;

    validator.navigateToNextLevel();

    expect(mockEditor.loadLevel).not.toHaveBeenCalled();
    expect(mockEditor.showCompletionMessage).toHaveBeenCalled();
  });
});
