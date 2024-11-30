import { Product } from '../../../domain';

export default class ProductMapper {
  static toPersistence(product: Product): unknown {
    return {
      id: product.id,
      storageId: product.storageId,
      name: product.name,
      quantity: product.quantity,
      createdAt: product.createdAt.toISOString(),
    };
  }

  static toDomain(data: unknown): Product {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data');
    }

    if (
      !('id' in data) ||
      typeof data.id !== 'string' ||
      !('storageId' in data) ||
      typeof data.storageId !== 'string' ||
      !('quantity' in data) ||
      typeof data.quantity !== 'number' ||
      !('name' in data) ||
      typeof data.name !== 'string' ||
      !('createdAt' in data) ||
      typeof data.createdAt !== 'string'
    ) {
      throw new Error('Invalid data');
    }

    return new Product(data.id, data.storageId, data.name, data.quantity, new Date(data.createdAt));
  }
}
