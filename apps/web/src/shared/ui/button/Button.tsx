import { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import styles from './Button.module.scss';

const variants = {
  primary: styles.primary,
  secondary: styles.secondary,
  disabled: styles.disabled,
  green: styles.green,
  red: styles.red,
};

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9Z"
      stroke="currentColor"
      strokeWidth="1.275"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 5.25V9L12 10.5"
      stroke="currentColor"
      strokeWidth="1.275"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface Props extends PropsWithChildren, ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  leftIcon?: ReactNode;
  loading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  leftIcon,
  loading = false,
  disabled,
  ...rest
}: Props) => {
  const className = variants[variant];
  const isDisabled = variant === 'disabled' || disabled || loading;

  return (
    <button className={`${styles.button} ${className}`} disabled={isDisabled} {...rest}>
      {loading && (
        <span className={styles.leftIcon}>
          <ClockIcon />
        </span>
      )}
      {!loading && leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      <span className={styles.text}>{loading ? 'Загрузка…' : children}</span>
    </button>
  );
};
