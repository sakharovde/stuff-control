import { FC, useContext, useLayoutEffect, useState } from 'react';
import { BatchDto, ProductDto } from '../../application';
import CoreContext from '../core-context.ts';

type Props = {
  productId: ProductDto['id'];
};

const ProductWidget: FC<Props> = (props) => {
  const core = useContext(CoreContext);
  const [batches, setBatches] = useState<BatchDto[]>([]);

  useLayoutEffect(() => {
    core.queries.batch.getByProduct({ productId: props.productId }).then(setBatches);
  }, [core]);

  return (
    <div>
      <h3 className='text-xl font-semibold px-3'>Items</h3>
      <div className='px-3 py-5 flex flex-col gap-1'>
        {batches.map((item) => (
          <div key={item.id} className='py-1 px-3 rounded-md bg-gray-100 border border-gray-50'>
            <div className='flex justify-between gap-5'>
              <div className='flex-1 text-sm'>{item.expirationDate?.toISOString().split('T')[0] || 'Other'}</div>
              <div className='flex flex-col gap-1'>
                <div className='flex gap-2'>
                  <div className='font-semibold text-lg flex items-center justify-center text-gray-500'>
                    {item.quantity}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductWidget;
