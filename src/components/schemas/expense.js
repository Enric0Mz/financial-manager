export const CreditExpense = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 1,
    },
    name: {
      type: "string",
      example: "Exemplo de compra",
    },
    description: {
      type: "string",
      example: "Exemplo de descricao de compra",
    },
    total: {
      type: "number",
      format: "float",
      example: 432.19,
    },
    expense_date: {
      type: "string",
      format: "date-time",
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
    bank_bank_statement_id: {
      type: "integer",
      format: "int64",
      example: 1,
    },
    bank_statement_id: {
      type: "integer",
      format: "int64",
      example: 1,
    },
  },
};

export const CreditExpenseCreate = {
  type: "object",
  properties: {
    name: {
      type: "string",
      example: "Exemplo de compra",
    },
    description: {
      type: "string",
      example: "Exemplo de descricao de compra",
    },
    total: {
      type: "number",
      format: "float",
      example: 432.19,
    },
    bankBankStatementId: {
      type: "integer",
      format: "int64",
      example: 1,
    },
  },
};

export const CreditExpenseUpdate = {
  type: "object",
  properties: {
    name: {
      type: "string",
      example: "Exemplo de compra",
    },
    description: {
      type: "string",
      example: "Exemplo de descricao de compra",
    },
    total: {
      type: "number",
      format: "float",
      example: 432.19,
    },
  },
};
