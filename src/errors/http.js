export class ConflictError extends TypeError {
  constructor({ cause }, value) {
    super(`Value ${value} already exists on table`, {
      cause: cause,
    });
    (this.name = "conflict"),
      (this.message = `Value ${value} already exists on table. Insert other value`),
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
