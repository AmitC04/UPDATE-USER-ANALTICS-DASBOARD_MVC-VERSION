/**
 * LoadingSpinner - Shared loading state component
 * Issue #16 - Consistent loading UI across all components
 */

interface LoadingSpinnerProps {
  /** Optional label shown below the spinner */
  message?: string;
  /** Full-page centered variant (default: true) */
  fullPage?: boolean;
}

export function LoadingSpinner({ message = 'Loading...', fullPage = true }: LoadingSpinnerProps) {
  const wrapper = fullPage
    ? 'flex flex-col items-center justify-center min-h-[200px] p-6'
    : 'flex flex-col items-center justify-center p-4';

  return (
    <div className={wrapper} role="status" aria-label={message}>
      <svg
        className="animate-spin h-8 w-8 text-blue-600 mb-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
