export const Bank = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 1,
    },
    bank: {
      type: "string",
      example: "Banco B",
    },
  },
};

export const ListOfBanks = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        $ref: "#/components/schemas/Bank",
      },
    },
  },
};

export const BankCreate = {
  type: "object",
  properties: {
    bank: {
      type: "string",
      example: "Banco B",
    },
  },
};

export const BankUpdate = {
  type: "object",
  properties: {
    name: {
      type: "string",
      example: "Banco (atualizado)",
    },
  },
};
