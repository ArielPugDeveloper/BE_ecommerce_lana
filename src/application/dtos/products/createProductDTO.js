export class createProductDTO {
  constructor(data) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      throw new Error('Product name is required and must be a string.');
    }
    if (isNaN(parseFloat(data.price)) || parseFloat(data.price) < 0) {
      throw new Error('Product price must be a non-negative number.');
    }
    if (isNaN(parseInt(data.stock)) || parseInt(data.stock) < 0) {
      throw new Error('Product stock must be a non-negative integer.');
    }

    this.name = data.name.trim();
    this.color = data.color.trim();
    this.description = data.description || '';
    this.price = parseFloat(data.price);
    this.stock = parseInt(data.stock);
    this.image_url = data.image_url;
  }
}