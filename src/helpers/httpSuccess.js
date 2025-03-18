export class httpSuccessCreated {
  constructor(message, object) {
    this.name = "created";
    this.message = message;
    this.statusCode = 201;
    this.object = object;
  }
  toJson() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
      data: this.object,
    };
  }
}

export class httpSuccessUpdated {
  constructor(result) {
    this.name = "updated";
    this.message = `value updated to ${result.name}`;
    this.statusCode = 200;
    this.data = result;
  }

  toJson() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
      data: this.data,
    };
  }
}

export class httpSuccessDeleted {
  constructor(value) {
    this.name = "deleted";
    this.message = `value ${value} deleted successfuly`;
    this.statusCode = 200;
  }
  toJson() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
    };
  }
}
