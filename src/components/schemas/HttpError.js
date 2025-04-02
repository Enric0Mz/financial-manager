const InternalServerError = {
  type: "object",
  properties: {
    status_code: {
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
