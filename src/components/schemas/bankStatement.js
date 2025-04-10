export const BankStatement = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 1,
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
    salaryId: {
      type: "integer",
      format: "int64",
      example: 1,
    },
    userId: {
      type: "integer",
      format: "int64",
      example: 1,
    },
    expenseId: {
      type: "integer",
      format: "int64",
      example: 1,
    },
    yearMonthId: {
      type: "integer",
      format: "int64",
      example: 1,
    },
    balanceInitial: {
      type: "number",
      format: "float",
      example: 2500.87,
    },
    balanceTotal: {
      type: "number",
      format: "float",
      example: 2500.87,
    },
    balanceReal: {
      type: "number",
      format: "float",
      example: 2223.17,
    },
    debitBalance: {
      type: "number",
      format: "float",
      example: 321.98,
    },
    salary: {
      $ref: "#/components/schemas/Salary",
    },
    expenses: {
      type: "object",
      example: {
        $ref: "#/components/schemas/Expense",
      },
    },
    banks: {
      type: "array",
      items: {
        $ref: "#/components/schemas/Bank",
      },
    },
  },
};

export const ListOfBankStatements = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        $ref: "#/components/schemas/BankStatement",
      },
    },
  },
};
