import StorageTransactionRepository from '../../domain/repositories/storage-transaction-repository.ts';
import StorageTransaction from '../../domain/models/storage-transaction.ts';
import LocalForageFactory from '../factories/localforage-factory.ts';
import Storage from '../../domain/models/storage.ts';
import Product from '../../domain/models/product.ts';

export class StorageTransactionRepositoryImpl implements StorageTransactionRepository {
  private readonly client = LocalForageFactory.createInstance({
    name: 'storage-transactions',
    storeName: 'v1',
    description: 'Database for storage items',
  });

  async findUnappliedByStorageIdAndProductId(
    storageId: Storage['id'],
    productId: Product['id']
  ): Promise<StorageTransaction | null> {
    const storageTransactions: StorageTransaction[] = [];
    await this.client.iterate((value) => {
      const storageTransaction = value as StorageTransaction;
      if (storageTransaction.storageId === storageId && storageTransaction.productId === productId) {
        storageTransactions.push(storageTransaction);
      }
    });
    return storageTransactions.find((storageTransaction) => storageTransaction.state === 'pending') || null;
  }

  async findAllUnappliedByStorageId(storageId: Storage['id']): Promise<StorageTransaction[]> {
    const storageTransactions: StorageTransaction[] = [];
    await this.client.iterate((value) => {
      const storageTransaction = value as StorageTransaction;
      if (storageTransaction.storageId === storageId && storageTransaction.state === 'pending') {
        storageTransactions.push(storageTransaction);
      }
    });
    return storageTransactions;
  }

  save(storageTransaction: StorageTransaction): Promise<StorageTransaction> {
    return this.client.setItem(storageTransaction.id, storageTransaction);
  }

  remove(storageTransaction: StorageTransaction): Promise<void> {
    return this.client.removeItem(storageTransaction.id);
  }
}