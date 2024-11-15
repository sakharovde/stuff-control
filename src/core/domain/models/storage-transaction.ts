export default class StorageTransaction {
  constructor(
    public id: string,
    public storageId: string,
    public productId: string,
    public quantityChange: number,
    public transactionType: 'ADD' | 'REMOVE',
    public createdAt: Date = new Date()
  ) {}
}
