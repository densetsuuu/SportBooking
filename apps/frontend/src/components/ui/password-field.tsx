import { EyeIcon, EyeOffIcon } from 'lucide-react'
import React, { useState } from 'react'

import { Input } from './input'

interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  divClassName?: string
  autogenerate?: boolean
}

const PasswordField: React.FunctionComponent<PasswordFieldProps> = ({
  divClassName,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={divClassName}>
      <div style={{ position: 'relative' }}>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          onChange={onChange}
          {...props}
        />
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          aria-controls="password"
        >
          {showPassword ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}
        </button>
      </div>
    </div>
  )
}

export { PasswordField }
