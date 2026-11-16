import { InputHTMLAttributes } from 'react';
import styles from './TextInput.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const TextInput = ({ error = false, className, ...rest }: Props) => {
  const classNames = [styles.input, error ? styles.error : '', className]
    .filter(Boolean)
    .join(' ');

  return <input className={classNames} aria-invalid={error || undefined} {...rest} />;
};
