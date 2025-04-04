export const Month = {
  type: "object",
  properties: {
    numeric: {
      type: "integer",
      format: "int64",
      defaul: 1,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    month: {
      type: "string",
      default: "January",
      enum: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
  },
};

export const ListOfMonths = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        $ref: "#/components/schemas/Month",
      },
    },
  },
};

export const MonthCreate = {
  type: "object",
  properties: {
    month: {
      type: "string",
      example: "January",
    },
  },
};
