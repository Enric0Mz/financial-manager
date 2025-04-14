export const User = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 1,
    },
    username: {
      type: "string",
      example: "ExemploDeNome",
    },
    password: {
      type: "string",
      example: "Senha@123",
    },
    email: {
      type: "string",
      format: "email",
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
  },
};

export const UserCreate = {
  type: "object",
  properties: {
    username: {
      type: "string",
      example: "ExemploDeNome",
    },
    password: {
      type: "string",
      example: "Senha@123",
    },
    email: {
      type: "string",
      format: "email",
    },
  },
};
