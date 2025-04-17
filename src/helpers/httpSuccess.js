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
  constructor(result, value) {
    this.name = "updated";
    this.message = `value updated to ${result.name || value}`;
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

export class HttpSuccessAuthenticated {
  constructor(data) {
    (this.name = "authenticated"),
      (this.message = "User authenticated successfuly"),
      (this.statusCode = 200);
    this.data = data;
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

export class HttpSuccessRefreshed {
  constructor(data) {
    (this.name = "refreshed session"),
      (this.message = "User refreshed session sucessfuly"),
      (this.statusCode = 200);
    this.data = data;
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

export class HttpSuccessLoggedOut {
  constructor() {
    (this.name = "logout"),
      (this.message = "User logged out successfully"),
      (this.statusCode = 200);
  }

  toJson() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
    };
  }
}
