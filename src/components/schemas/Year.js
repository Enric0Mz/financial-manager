export const Year = {
  type: "object",
  properties: {
    year: {
      type: "integer",
      format: "int64",
      example: 2025,
    },
  },
};

export const ListOfYears = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        $ref: "#/components/schemas/Year",
      },
    },
  },
};
