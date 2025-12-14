import React from 'react';
import styles from './PaymentMethodList.module.css';

export type PaymentMethod = 'card' | 'toss' | 'bank';

type Props = {
  value: PaymentMethod;
  onChange: (next: PaymentMethod) => void;
};

const METHODS: { value: PaymentMethod; label: string; description: string }[] = [
  { value: 'toss', label: '토스 간편결제', description: '토스 앱 인증' },
  { value: 'card', label: '신용/체크카드', description: 'VISA, Mastercard, 국내 전 카드' },
  { value: 'bank', label: '계좌이체', description: '실시간 이체' },
];

export const PaymentMethodList: React.FC<Props> = ({ value, onChange }) => {
  const handleSelect = (methodValue: PaymentMethod, disabled: boolean) => {
    if (disabled) return;
    onChange(methodValue);
  };

  return (
    <ul className={styles['payment-method']}>
      {METHODS.map((method) => (
        <li
          key={method.value}
          className={`${styles['payment-method__item']} ${
            method.value !== 'toss' ? styles['payment-method__item--disabled'] : ''
          }`}
          role="radio"
          aria-checked={value === method.value}
          tabIndex={method.value === 'toss' ? 0 : -1}
          onClick={() => handleSelect(method.value, method.value !== 'toss')}
          onKeyDown={(event) => {
            if (event.key === ' ' || event.key === 'Enter') {
              event.preventDefault();
              handleSelect(method.value, method.value !== 'toss');
            }
          }}
        >
          <label
            className={`${styles['payment-method__option']} ${
              method.value !== 'toss' ? styles['payment-method__option--disabled'] : ''
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <input
              type="radio"
              name="payment"
              value={method.value}
              checked={value === method.value}
              readOnly
              disabled={method.value !== 'toss'}
            />
            <span className={styles['payment-method__label']}>
              <strong>{method.label}</strong>
              <span>{method.description}</span>
              {method.value !== 'toss' && (
                <span className={styles['payment-method__disabled-hint']}>준비 중</span>
              )}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
};
