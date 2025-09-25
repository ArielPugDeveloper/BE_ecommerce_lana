
export class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.description = data.description;
    this.price = data.price;
    this.stock = data.stock;
    this.image_url = data.image_url;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Método de negocio para formatear el precio
  getFormattedPrice() {
    return `$${this.price.toFixed(2)}`;
  }
}