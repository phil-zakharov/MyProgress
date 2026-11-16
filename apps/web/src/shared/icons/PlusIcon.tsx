import { IconProps } from './types';

export const PlusIcon = ({ size = 18 }: IconProps) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' width={size} height={size} fill='none'>
      <path
        d='M9 3.75V9M9 9V14.25M9 9H3.75M9 9H14.25'
        stroke='currentColor'
        strokeWidth={1.7 * (size / 18)}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
