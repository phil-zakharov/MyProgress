import { PropsWithChildren } from 'react';

import styles from './Badge.module.scss';

const statuses = {
  pending: styles.pending,
  done: styles.done,
  skipped: styles.skipped,
  'in-progress': styles.inProgress,
};

interface Props extends PropsWithChildren {
  status: keyof typeof statuses;
}

export const Badge = ({ status, children }: Props) => {
  return <span className={`${styles.badge} ${statuses[status]}`}>{children}</span>;
};
