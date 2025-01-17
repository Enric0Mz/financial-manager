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
    super(`Value ${value} does not exist on table`);
    this.name = "not found";
    this.message = `Value ${value} does not exist on table. Try another value`;
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

export class InvalidHttpMethodError extends Error {
  constructor(value) {
    super(`Value ${value} not allowed on this route`);
    this.name = "invalid method";
    this.statusCode = 405;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
    };
  }
}

export class InternalServerError extends Error {
  constructor(cause) {
    super("Internal server error.", {
      cause: cause,
    });
    this.name = "internal server error";
    this.statusCode = 500;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
    };
  }
}
