export class user {
  /**
   * Representa a un usuario en el sistema.
   * @param {object} data - Los datos del usuario.
   * @param {string} data.id - El identificador único del usuario.
   * @param {string} data.name - El nombre del usuario.
   * @param {string} data.email - El correo electrónico único del usuario.
   * @param {string} data.password - La contraseña del usuario (será hasheada).
   * @param {string} data.celular- El celular del usuario.
   * @param {string} data.role - El rol del usuario (ej: 'SUPER_USER', 'REGULAR_USER').
   */

  constructor(data) {
    if (!data.name || !data.email || !data.password || !data.celular) {
      throw new Error('User data is incomplete. Name, email, and password are required.');
    }

    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.celular = data.celular;
    // Asigna un rol por defecto si no existe en los datos
    this.role = data.role || 'REGULAR_USER'; 
  }

}