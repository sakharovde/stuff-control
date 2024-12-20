import ProductDto from './product-dto.ts';
import { Storage } from '../../domain';
import { StorageDtoFactory } from './storage-dto.ts';

export default interface StorageWithProductsDto {
  id: Storage['id'];
  name: Storage['name'];
  products: Array<ProductDto>;
}

export class StorageWithProductsDtoFactory {
  public static create = (storage: Storage, products: ProductDto[]): StorageWithProductsDto => {
    return {
      ...StorageDtoFactory.create(storage),
      products,
    };
  };
}
