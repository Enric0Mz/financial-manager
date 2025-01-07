export class ConflictError extends TypeError {
  constructor({ cause }) {
    super("Value already exists on table", {
      cause: cause,
    });
    (this.name = "conflict"),
      (this.message = "Insira um valor novo"),
      (this.statusCode = 409);
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
    };
  }
}
