import { IconProps } from './types';

export const StopIcon = ({ size = 18 }: IconProps) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' width={size} height={size} fill='none'>
      <path
        d='M6 4.5H12C12.8284 4.5 13.5 5.17157 13.5 6V12C13.5 12.8284 12.8284 13.5 12 13.5H6C5.17157 13.5 4.5 12.8284 4.5 12V6C4.5 5.17157 5.17157 4.5 6 4.5Z'
        stroke='currentColor'
        strokeWidth={1.7 * (size / 18)}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
