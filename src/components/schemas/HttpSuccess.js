const HttpSuccess = {
  type: "object",
  properties: {
    statusCode: {
      type: "integer",
      format: "int64",
      example: 200,
    },
    name: {
      type: "string",
      example: "operation performed successfuly",
    },
    message: {
      type: "string",
      example: "Success message.",
    },
    data: {
      type: "object",
      example: {
        id: 1,
        name: "example object",
      },
    },
  },
};

export default HttpSuccess;
