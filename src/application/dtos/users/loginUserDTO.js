export class LoginUserDTO {
  constructor(data) {
    if (!data.email || typeof data.email !== 'string') {
      throw new Error('Email is required.');
    }
    if (!data.password || typeof data.password !== 'string') {
      throw new Error('Password is required.');
    }

    this.email = data.email.toLowerCase();
    this.password = data.password;
  }
}
