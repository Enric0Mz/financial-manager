export const ExtraIncome = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 1,
    },
    name: {
      type: "string",
      example: "Bonificao extra",
    },
    amount: {
      type: "number",
      format: "float",
      example: 325.18,
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
    bankStatement_it: {
      type: "integer",
      format: "int64",
      example: 1,
    },
  },
};

export const ListOfExtraIncome = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        $ref: "#/components/schemas/ExtraIncome",
      },
    },
  },
};

export const ExtraIncomeCreate = {
  type: "object",
  properties: {
    name: {
      type: "string",
      example: "Bonificao extra",
    },
    amount: {
      type: "number",
      format: "float",
      example: 325.18,
    },
  },
};
