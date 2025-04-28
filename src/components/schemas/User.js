export const User = {
  type: "object",
  properties: {
    username: {
      type: "string",
      example: "ExemploDeNome",
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
      example: "exemplo@email.com",
    },
  },
};

export const UserUpdate = {
  type: "object",
  properties: {
    username: {
      type: "string",
      example: "ExemploDeNome",
    },
  },
};

export const UserLogin = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      example: "exemplo@email.com",
    },
    password: {
      type: "string",
      example: "Senha@123",
    },
  },
};
