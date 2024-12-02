import { Batch } from '../../../domain';

export default class BatchMapper {
  static toDomain = (data: unknown) => {
    if (!data || typeof data !== 'object') {
      return null;
    }

    if (
      !('id' in data) ||
      typeof data.id !== 'string' ||
      !('productId' in data) ||
      typeof data.productId !== 'string'
    ) {
      return null;
    }

    const id: Batch['id'] = data.id;
    const productId: Batch['productId'] = data.productId;

    let quantity: Batch['quantity'] = 0;

    if ('quantity' in data && typeof data.quantity === 'number') {
      quantity = data.quantity;
    }

    let expirationDate: Batch['expirationDate'] = null;

    if (
      'expirationDate' in data &&
      typeof data.expirationDate === 'string' &&
      !isNaN(Date.parse(data.expirationDate))
    ) {
      expirationDate = new Date(data.expirationDate);
    }

    let createdAt: Batch['createdAt'] = new Date();

    if ('createdAt' in data && typeof data.createdAt === 'string' && !isNaN(Date.parse(data.createdAt))) {
      createdAt = new Date(data.createdAt);
    }

    return new Batch(id, productId, quantity, expirationDate, createdAt);
  };

  static toPersistence = (batch: Batch) => {
    return {
      id: batch.id,
      productId: batch.productId,
      quantity: batch.quantity,
      expirationDate: batch.expirationDate?.toISOString() || null,
      createdAt: batch.createdAt.toISOString(),
    };
  };
}
