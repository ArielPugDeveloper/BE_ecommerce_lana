export class productResponseDTO {
  constructor(productEntity) {
    this.id = productEntity.id;
    this.name = productEntity.name;
    this.color = productEntity.color;
    this.description = productEntity.description;
    this.price = productEntity.price;
    this.stock = productEntity.stock;
    this.image_url = productEntity.image_url;
  }
}