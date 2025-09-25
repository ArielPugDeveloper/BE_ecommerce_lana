export class userRepository {
    /**
     * Busca un usuario por su dirección de correo electrónico.
     * @param {string} email
     * @returns {Promise<User|null>}
     */
    async findByEmail(email) {
        throw new Error('Method not implemented');
    }

    /**
     * Busca un usuario por su ID.
     * @param {string} id
     * @returns {Promise<User|null>}
     */
    async findById(id) {
        throw new Error('Method not implemented');
    }

    /**
     * Crea un nuevo usuario en la base de datos.
     * @param {User} user
     * @returns {Promise<User>}
     */
    async create(user) {
        throw new Error('Method not implemented');
    }
}