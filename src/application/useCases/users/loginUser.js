import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginUserDTO } from '../../dtos/users/loginUserDTO.js';

// El caso de uso recibe el repositorio de usuarios como dependencia
export function loginUserFactory(userRepository) {
  return async (userData) => {
    // 1. Validar los datos de entrada
    const loginUserDTO = new LoginUserDTO(userData);

    // 2. Buscar el usuario en la base de datos
    const user = await userRepository.findByEmail(loginUserDTO.email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    // 3. Comparar la contraseña ingresada con la contraseña hasheada
    const isPasswordValid = await bcrypt.compare(loginUserDTO.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password.');
    }

    // 4. Generar el token de autenticación (JWT)
    // El token contendrá el ID y el rol del usuario, información importante para la autorización
const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET, // Secreto de la variable de entorno
  { expiresIn: '15m' }
);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        celular: user.celular,
        role: user.role,
      },
      token,
    };
  };
}