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

export class NotFoundError extends Error {
  constructor(value) {
    super(`value ${value} already exist on table`);
    this.name = "not found";
    this.message = `value ${value} already exist on table. Insert a new value`;
    this.statusCode = 404;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
    };
  }
}
