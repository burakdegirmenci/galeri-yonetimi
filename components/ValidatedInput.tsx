'use client'

import { useState, useEffect } from 'react'
import { FormError } from './ErrorMessage'

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  validate?: (value: string) => { isValid: boolean; error?: string }
  onValidChange?: (value: string, isValid: boolean) => void
  showError?: boolean
}

export default function ValidatedInput({
  label,
  error: externalError,
  validate,
  onValidChange,
  showError = true,
  required,
  className = '',
  ...props
}: ValidatedInputProps) {
  const [touched, setTouched] = useState(false)
  const [internalError, setInternalError] = useState<string>('')

  const error = externalError || internalError

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true)
    if (validate && e.target.value) {
      const result = validate(e.target.value)
      setInternalError(result.error || '')
      if (onValidChange) {
        onValidChange(e.target.value, result.isValid)
      }
    }
    if (props.onBlur) {
      props.onBlur(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (touched && validate) {
      const result = validate(e.target.value)
      setInternalError(result.error || '')
      if (onValidChange) {
        onValidChange(e.target.value, result.isValid)
      }
    }
    if (props.onChange) {
      props.onChange(e)
    }
  }

  return (
    <div className={className}>
      <label className="label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        required={required}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`input ${error && touched ? 'input-error' : ''}`}
      />
      {showError && touched && error && <FormError error={error} />}
    </div>
  )
}

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  validate?: (value: string) => { isValid: boolean; error?: string }
  onValidChange?: (value: string, isValid: boolean) => void
  showError?: boolean
}

export function ValidatedTextarea({
  label,
  error: externalError,
  validate,
  onValidChange,
  showError = true,
  required,
  className = '',
  ...props
}: ValidatedTextareaProps) {
  const [touched, setTouched] = useState(false)
  const [internalError, setInternalError] = useState<string>('')

  const error = externalError || internalError

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setTouched(true)
    if (validate && e.target.value) {
      const result = validate(e.target.value)
      setInternalError(result.error || '')
      if (onValidChange) {
        onValidChange(e.target.value, result.isValid)
      }
    }
    if (props.onBlur) {
      props.onBlur(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (touched && validate) {
      const result = validate(e.target.value)
      setInternalError(result.error || '')
      if (onValidChange) {
        onValidChange(e.target.value, result.isValid)
      }
    }
    if (props.onChange) {
      props.onChange(e)
    }
  }

  return (
    <div className={className}>
      <label className="label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        {...props}
        required={required}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`input ${error && touched ? 'input-error' : ''} resize-none`}
      />
      {showError && touched && error && <FormError error={error} />}
    </div>
  )
}
