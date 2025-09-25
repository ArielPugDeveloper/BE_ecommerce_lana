export class CreateUserDTO {
  constructor(data) {
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('User name is required and must be a string.');
    }
    if (!data.email || typeof data.email !== 'string' || !this.isValidEmail(data.email)) {
      throw new Error('Valid email is required.');
    }
    if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
      throw new Error('Password is required and must be at least 6 characters long.');
    }
    if (!data.celular || typeof data.celular !== 'string') {
      throw new Error('Celular is required and must be a string.');
    }

    this.name = data.name;
    this.email = data.email.toLowerCase(); // Guarda el email en minúsculas
    this.password = data.password;
    this.celular = data.celular;
    this.role = data.role || 'REGULAR_USER'; // Establece un rol por defecto
  }

  isValidEmail(email) {
    // Regex simple para validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}