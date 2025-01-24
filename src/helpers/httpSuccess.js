export class httpSuccessCreated {
  constructor(message) {
    this.name = "created";
    this.message = message;
    this.statusCode = 201;
  }
  toJson() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
    };
  }
}
