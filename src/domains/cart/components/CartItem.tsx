import React from 'react';
import Image from 'next/image';
import { formatAbsoluteUrl } from '@/domains/course/utils/formatAbsoluteUrl';
import { CartItem as CartItemType } from '../types/cart';
import styles from './CartItem.module.css';

type Props = {
  item: CartItemType;
  checked?: boolean;
  onSelectChange?: (checked: boolean) => void;
};

export const CartItem: React.FC<Props> = ({ item, checked = false, onSelectChange }) => {
  const handleSelect = (nextChecked: boolean) => {
    onSelectChange?.(nextChecked);
  };

  return (
    <li
      className={styles['cart-item']}
      onClick={() => handleSelect(!checked)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          handleSelect(!checked);
        }
      }}
    >
      <label className={styles['cart-item__select']} onClick={(event) => event.stopPropagation()}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            event.stopPropagation();
            handleSelect(event.target.checked);
          }}
          className={styles['cart-item__checkbox']}
          aria-label={`${item.title} 선택`}
        />
      </label>
      <div className={styles['cart-item__thumb']}>
        <Image
          src={formatAbsoluteUrl(item.thumbnailUrl)}
          alt={`${item.title} 썸네일`}
          width={80}
          height={64}
        />
      </div>
      <div className={styles['cart-item__info']}>
        <p className={styles['cart-item__title']}>{item.title}</p>
        <p className={styles['cart-item__meta']}>{item.instructor}</p>
        <div className={styles['cart-item__price']}>
          <span className={styles['cart-item__price-final']}>{item.price.toLocaleString()}원</span>
          {item.originalPrice > item.price && (
            <span className={styles['cart-item__price-original']}>
              {item.originalPrice.toLocaleString()}원
            </span>
          )}
        </div>
      </div>
    </li>
  );
};
