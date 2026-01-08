'use client'

import LoadingSpinner from './LoadingSpinner'

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  fullWidth?: boolean
}

export default function LoadingButton({
  loading = false,
  children,
  variant = 'primary',
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: LoadingButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  }

  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className} relative`}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </span>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </button>
  )
}
