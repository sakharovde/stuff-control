import StorageTransactionRepository from '../../domain/repositories/storage-transaction.ts';
import StorageTransaction from '../../domain/models/storage-transaction.ts';
import LocalForageFactory from '../factories/localforage.ts';

export class StorageTransactionRepositoryImpl implements StorageTransactionRepository {
  private readonly client = LocalForageFactory.createInstance({
    name: 'storage-transactions',
    storeName: 'v1',
    description: 'Database for storage items',
  });

  async save(storageTransaction: StorageTransaction): Promise<StorageTransaction> {
    return this.client.setItem(storageTransaction.id, storageTransaction);
  }
}
