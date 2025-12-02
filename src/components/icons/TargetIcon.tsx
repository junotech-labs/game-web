import { IconProps } from '../../types/common';

export function TargetIcon({ className = "w-12 h-12" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}
