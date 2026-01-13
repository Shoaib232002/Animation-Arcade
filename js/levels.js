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

export { createLevel };
