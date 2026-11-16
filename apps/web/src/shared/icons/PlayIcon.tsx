import { IconProps } from './types';

export const PlayIcon = ({ size = 18 }: IconProps) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' width={size} height={size} fill='none'>
      <path
        d='M6.75 3.75L14.25 9L6.75 14.25V3.75Z'
        stroke='currentColor'
        strokeWidth={1.7 * (size / 18)}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
