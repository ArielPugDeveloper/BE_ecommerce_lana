export class UserResponseDTO {
  constructor(userEntity) {
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.celular = userEntity.celular;
    this.role = userEntity.role;
  }
}