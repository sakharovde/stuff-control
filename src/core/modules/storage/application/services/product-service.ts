import ProductRepository from '../../domain/repositories/product-repository.ts';
import Product from '../../domain/models/product.ts';
import { v4 as uuidv4 } from 'uuid';
import ProductNameEmptySpecification from '../../domain/specifications/product-name-empty-specification.ts';

export default class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private readonly productNameEmptySpecification: ProductNameEmptySpecification
  ) {}

  async create(name: Product['name']): Promise<Product> {
    const isNameEmpty = await this.productNameEmptySpecification.isSatisfiedBy(name);
    if (isNameEmpty) {
      throw new Error('Product name cannot be empty');
    }

    const product = new Product(uuidv4(), name);
    return this.productRepository.save(product);
  }

  getById = async (id: Product['id']): Promise<Product | null> => {
    return this.productRepository.findById(id);
  };
}