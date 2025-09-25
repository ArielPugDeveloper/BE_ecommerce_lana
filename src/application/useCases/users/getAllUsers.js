

export function getAllUsersFactory(userRepository) {
  return async () => {
    return await userRepository.findAll();
  };
}