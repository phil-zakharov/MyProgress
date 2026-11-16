import { IconProps } from './types';

export const AddIcon = ({ size = 24 }: IconProps) => {
  switch (size) {
    case 20:
      return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' height='20px' width='20px' fill='#e3e3e3'>
          <path d='M9.25,10.75H5V9.25H9.25V5h1.5V9.25H15v1.5H10.75V15H9.25V10.75Z' />
        </svg>
      );
    case 24:
      return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' height='24px' width='24px' fill='#e3e3e3'>
          <path d='M11,13H5V11h6V5h2v6h6v2H13v6H11V13Z' />
        </svg>
      );
    default:
      return null;
  }
};
