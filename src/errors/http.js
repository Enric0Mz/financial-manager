export class ConflictError extends TypeError {
  constructor({ cause }, value) {
    super(`Value ${value} already exists on table. Insert other value`, {
      cause: cause,
    });
    (this.name = "conflict"), (this.statusCode = 409);
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
    super(`Value ${value} does not exist on table. Try another value`);
    this.name = "not found";
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
  constructor(cause, statusCode) {
    super("Internal server error.", {
      cause: cause,
    });
    this.message = cause.message;
    this.name = cause.name || "internal server error";
    this.statusCode = statusCode || 500;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
    };
  }
}

export class UnprocessableEntityError extends Error {
  constructor(cause, fields) {
    super(`fields [${fields}] not found`, {
      cause,
    });
    this.name = "unprocessable entity";
    this.statusCode = 422;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
    };
  }
}
