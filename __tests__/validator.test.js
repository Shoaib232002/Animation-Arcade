import { jest } from "@jest/globals";

const mockGetLevels = jest.fn();

jest.unstable_mockModule("../js/levels-data.js", () => ({
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

    mockLevels = [
      createMockLevel(1, "transform: rotate(45deg)"),
      createMockLevel(2, "transform: scale(2)"),
      createMockLevel(3, "transform: translate(100px)"),
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

      progressManager: {
        markLevelComplete: jest.fn(),
      },
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
    expect(mockEditor.progressManager.markLevelComplete).toHaveBeenCalledWith(
      mockEditor.currentLevel
    );

    jest.advanceTimersByTime(VALIDATOR_CONSTANTS.DELAYS.SUCCESS_MESSAGE);

    expect(validator.updateSubmitButton).toHaveBeenCalled();
    expect(validator.navigateToNextLevel).toHaveBeenCalled();
  });

  test("navigateToNextLevel should load next level when more levels exist", () => {
    mockEditor.currentLevel = 0;

    validator.navigateToNextLevel();

    expect(mockGetLevels).toHaveBeenCalled();
    expect(mockEditor.loadLevel).toHaveBeenCalledWith(
      0 + VALIDATOR_CONSTANTS.NAVIGATION.NEXT_LEVEL
    );
    expect(mockEditor.showCompletionMessage).not.toHaveBeenCalled();
  });

  test("navigateToNextLevel should show completion message at last level", () => {
    mockEditor.currentLevel = mockLevels.length - 1;

    validator.navigateToNextLevel();

    expect(mockEditor.loadLevel).not.toHaveBeenCalled();
    expect(mockEditor.showCompletionMessage).toHaveBeenCalled();
  });
});
