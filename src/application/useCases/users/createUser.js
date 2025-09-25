import bcrypt from 'bcryptjs';
import { CreateUserDTO } from '../../dtos/users/createUserDTO.js';
import { user } from '../../../domain/entities/user.js';

// Función para validar contraseña
function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (password.length < minLength) {
    throw new Error('La contraseña debe tener al menos 8 caracteres.');
  }
  
  if (!hasUpperCase) {
    throw new Error('La contraseña debe contener al menos una letra mayúscula.');
  }
  
  if (!hasNumber) {
    throw new Error('La contraseña debe contener al menos un número.');
  }
}

// El caso de uso recibe el repositorio de usuarios como dependencia
export function createUserFactory(userRepository) {
  return async (userData) => {
    // 1. Validar los datos de entrada usando el DTO
    const createUserDTO = new CreateUserDTO(userData);

    // 2. Validar contraseña
    validatePassword(createUserDTO.password);

    // 3. Revisar si ya existe un usuario con el mismo email
    const existingUser = await userRepository.findByEmail(createUserDTO.email);
    if (existingUser) {
      throw new Error('Email already in use.');
    }

    // 4. Hashear la contraseña para seguridad
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDTO.password, salt);

    // 5. Crear la entidad de usuario
    const newUserEntity = new user({
      name: createUserDTO.name,
      email: createUserDTO.email,
      password: hashedPassword,
      celular: createUserDTO.celular,
      role: createUserDTO.role,
    });

    // 6. Llamar al repositorio para guardar el usuario
    return await userRepository.create(newUserEntity);
  };
}