import { FC, useContext } from 'react';
import cn from 'classnames';
import StorageWithProductsDto from '../../core/modules/storage/application/dto/storage-with-products-dto.ts';
import StorageProductDto from '../../core/modules/storage/application/dto/storage-product-dto.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CoreContext from '../core-context.ts';

type StorageItemWidgetProps = {
  data: StorageProductDto;
  changedData: StorageProductDto | null;
  onClick: () => void;
  onClickPlus: () => void;
  onClickMinus: () => void;
};

const StorageProductWidget: FC<StorageItemWidgetProps> = (props) => {
  const quantity = props.changedData ? props.changedData.quantity : props.data.quantity;
  const quantityDelta = props.changedData ? props.changedData.quantity - props.data.quantity : 0;

  return (
    <div className={cn('py-1', 'pl-3', 'pr-1', 'rounded-md', 'bg-gray-100', 'border', 'border-gray-50')}>
      <div className='flex justify-between gap-5'>
        <div className='cursor-pointer flex-1' onClick={props.onClick}>
          {props.data.name}
        </div>

        <div className='flex flex-col gap-1'>
          <div className='flex gap-2'>
            <button
              className='bg-white py-3 px-5 rounded cursor-pointer flex items-center'
              onClick={props.onClickMinus}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <div
              className={cn(
                'font-semibold',
                'text-lg',
                'py-3',
                'w-10',
                'flex',
                'items-center',
                'justify-center',
                'text-gray-500'
              )}
            >
              {quantity}
            </div>
            <button className='bg-white py-3 px-5 rounded cursor-pointer flex items-center' onClick={props.onClickPlus}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <div className='flex justify-end'>
            {quantityDelta !== 0 && (
              <div
                className={cn('text-xs text-gray-500 flex gap-1', {
                  'text-gray-500': quantityDelta === 0,
                  'text-red-700': quantityDelta < 0,
                  'text-green-700': quantityDelta > 0,
                })}
              >
                <div>{props.data.quantity}</div>
                <div>
                  <FontAwesomeIcon icon={faArrowRightLong} />
                </div>
                <div>{props.changedData?.quantity}</div>
                <div>
                  ({quantityDelta > 0 ? '+' : ''}
                  {quantityDelta})
                </div>
              </div>
            )}
            {quantityDelta === 0 && <div className='text-xs text-gray-500'>No changes</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

type Props = {
  data: StorageWithProductsDto;
  onClickEditStorage: () => void;
  onClickAddProduct: () => void;
  onClickEditProduct: (storageProductId: StorageProductDto['id']) => void;
};

const StorageWidget: FC<Props> = (props) => {
  const core = useContext(CoreContext);
  const queryClient = useQueryClient();
  const queryKey = ['changedProducts', props.data.id];

  const changedProducts = useQuery({
    queryKey,
    queryFn: () => core.useCases.storage.getChangedProducts.execute(props.data.id),
  });

  const changeProductQuantityMutation = useMutation({
    mutationFn: core.useCases.storage.changeProductQuantity.execute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <div>
      <h3 className='text-xl font-semibold px-3'>{props.data.name}</h3>

      <div className='flex flex-col gap-3 mt-5 px-3'>
        {props.data.products.map((product) => {
          const changedData = changedProducts.data?.find((changedProduct) => changedProduct.id === product.id) || null;
          const quantity = changedData ? changedData.quantity : product.quantity;

          return (
            <StorageProductWidget
              key={product.id}
              data={product}
              changedData={changedData}
              onClick={() => props.onClickEditProduct(product.id)}
              onClickPlus={() =>
                changeProductQuantityMutation.mutate({
                  storageId: product.storageId,
                  productId: product.id,
                  quantity: quantity + 1,
                })
              }
              onClickMinus={() =>
                changeProductQuantityMutation.mutate({
                  storageId: product.storageId,
                  productId: product.id,
                  quantity: quantity - 1,
                })
              }
            />
          );
        })}
      </div>

      <div className='absolute bottom-0 left-0 h-10 bg-gray-100 w-full flex justify-between items-center px-3'>
        <button className='flex items-center gap-1 text-blue-600 font-medium' onClick={props.onClickEditStorage}>
          <span>Edit storage</span>
        </button>
        <button className='flex items-center gap-1 text-blue-600 font-medium' onClick={props.onClickAddProduct}>
          <span>Add product</span>
        </button>
      </div>
    </div>
  );
};

export default StorageWidget;
