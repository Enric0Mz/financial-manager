const InternalServerError = {
  type: "object",
  properties: {
    statusCode: {
      type: "integer",
      format: "int64",
      example: 500,
    },
    message: {
      type: "string",
      example: "Internal server error.",
    },
    name: {
      type: "string",
      example: "internal server error",
    },
  },
};

export default InternalServerError;
