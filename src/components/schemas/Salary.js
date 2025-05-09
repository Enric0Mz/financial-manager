export const Salary = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 1,
    },
    amount: {
      type: "number",
      format: "float",
      example: 1537.59,
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
  },
};

export const SalaryCreate = {
  type: "object",
  properties: {
    amount: {
      type: "number",
      format: "float",
      example: 1537.59,
    },
  },
};
