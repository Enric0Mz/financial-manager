export const Health = {
  type: "object",
  properties: {
    updated_at: {
      type: "string",
      format: "date-time",
    },
    dependencies: {
      type: "object",
      properties: {
        database: {
          type: "object",
          properties: {
            version: {
              type: "string",
              example: "16.0",
            },
            maxConnections: {
              type: "string",
              example: "100",
            },
            openedConnections: {
              type: "integer",
              format: "int64",
              example: 1,
            },
          },
        },
      },
    },
  },
};
