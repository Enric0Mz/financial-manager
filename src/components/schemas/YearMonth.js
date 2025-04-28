export const YearMonth = {
  type: "object",
  properties: {
    year: {
      type: "integer",
      format: "int64",
      example: 2025,
    },
    month: {
      type: "string",
      example: "January",
    },
  },
};
