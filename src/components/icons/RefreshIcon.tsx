import { IconProps } from '../../types/common';

export function RefreshIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.5 2V8M21.5 8H15.5M21.5 8L18 4.5C16.7429 3.24287 15.1068 2.44631 13.3438 2.22922C11.5807 2.01213 9.79283 2.38635 8.26393 3.29026C6.73503 4.19417 5.55108 5.57351 4.89842 7.2208C4.24576 8.8681 4.16047 10.6894 4.65624 12.3893C5.15201 14.0892 6.20034 15.5737 7.63843 16.6194C9.07652 17.6651 10.8241 18.2111 12.5991 18.1721C14.374 18.1331 16.0961 17.5113 17.4848 16.4029C18.8735 15.2945 19.8511 13.7629 20.27 12.04"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
