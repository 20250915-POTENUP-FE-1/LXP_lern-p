import React from 'react';
import styles from './TermsAgreementList.module.css';

export type TermsAgreementState = {
  all: boolean;
  required: boolean;
  marketing: boolean;
};

type Props = {
  value: TermsAgreementState;
  onChange: (next: TermsAgreementState) => void;
};

export const TermsAgreement: React.FC<Props> = ({ value, onChange }) => {
  const handleToggle = (key: keyof TermsAgreementState) => {
    const next = { ...value, [key]: !value[key] };
    if (key !== 'all') {
      next.all = next.required && next.marketing;
    } else {
      next.required = next.all;
      next.marketing = next.all;
    }
    onChange(next);
  };

  return (
    <div className={styles['terms']}>
      <label className={styles['terms__option']}>
        <input type="checkbox" checked={value.all} onChange={() => handleToggle('all')} />
        <span>전체 동의</span>
      </label>
      <label className={styles['terms__option']}>
        <input type="checkbox" checked={value.required} onChange={() => handleToggle('required')} />
        <span>[필수] 결제 이용 약관</span>
      </label>
      <label className={styles['terms__option']}>
        <input
          type="checkbox"
          checked={value.marketing}
          onChange={() => handleToggle('marketing')}
        />
        <span>[선택] 마케팅 수신 동의</span>
      </label>
    </div>
  );
};
