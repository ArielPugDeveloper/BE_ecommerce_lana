import { createUserFactory } from '../../application/useCases/users/createUser.js';
import { loginUserFactory } from '../../application/useCases/users/loginUser.js';
import { userRepository } from '../../infrastructure/repositories/user.repository.js';
import { getAllUsersFactory } from '../../application/useCases/users/getAllUsers.js';
import { deleteUser } from '../../application/useCases/users/deleteUser.js';
import { UserResponseDTO } from '../../application/dtos/users/userResponseDTO.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Se crea una instancia del caso de uso usando el patrón de inyección de dependencia
const createUser = createUserFactory(userRepository);
const logUser = loginUserFactory(userRepository);
const AllUsers = getAllUsersFactory(userRepository);

export const registerUser = async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    // Devolvemos una respuesta de éxito con los datos del nuevo usuario
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        celular: newUser.celular,
        role: newUser.role,
      },
    });
  } catch (error) {
    if (error.message === 'Email already in use.') {
      return res.status(409).json({ error: error.message });
    }
    // Para errores de validación del DTO o cualquier otro error
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { user, token } = await logUser(req.body);
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await AllUsers();
    const usersDTO = users.map(user => new UserResponseDTO(user));
    res.status(200).json(usersDTO);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, celular } = req.body; // Agregar 'celular' aquí

    // Solo el usuario autenticado puede actualizar su perfil
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'No tienes permiso para actualizar este usuario.' });
    }

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (celular) dataToUpdate.celular = celular; // Agregar esta línea
    if (password) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: dataToUpdate,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
};

// Endpoint para eliminar usuario (solo SUPER_USER)
export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Intentando eliminar usuario con ID:', id);
    const result = await deleteUser(id); // No convertir a parseInt, usar el ID directamente
    res.status(200).json(result);
  } catch (error) {
    console.error('Error en deleteUserController:', error);
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'No se puede eliminar un SUPER_USER') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

// Endpoint para validar token
export const validateToken = async (req, res) => {
  try {
    // Si llegamos aquí, el middleware de autenticación ya validó el token
    // Solo necesitamos devolver la información del usuario
    res.status(200).json({
      valid: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};