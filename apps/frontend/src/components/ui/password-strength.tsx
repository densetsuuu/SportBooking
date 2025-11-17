import React, { useMemo } from 'react'
import { FormDescription } from './form'

type PasswordStrengthProps = {
  password: string
  inputId?: string
}

export function PasswordStrength({ password, inputId }: PasswordStrengthProps) {
  if (!password.length) {
    return null
  }

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[0-9]/, text: 'At least 1 number' },
      { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
      { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
      {
        regex: /[-!@#$%^&*(),.?":{}|<>]/,
        text: 'At least 1 special character',
      },
    ]

    return requirements.map(req => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }

  const strength = checkStrength(password)

  const strengthScore = useMemo(() => {
    return strength.filter(req => req.met).length
  }, [strength])

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-border'
    if (score <= 1) return 'bg-red-500'
    if (score <= 2) return 'bg-orange-500'
    if (score <= 4) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const getStrengthText = (score: number) => {
    if (score === 0) return ''
    if (score <= 2) return 'Faible'
    if (score <= 4) return 'Moyen'
    return 'Fort'
  }

  return (
    <FormDescription>
      <span className="flex flex-col mt-2 gap-1">
        <span
          className="bg-border h-1 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-valuenow={strengthScore}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label="Password strength"
        >
          <span
            className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out block`}
            style={{ width: `${(strengthScore / 5) * 100}%` }}
          ></span>
        </span>
        <span
          id={`${inputId}-description`}
          className="text-muted-foreground text-xs font-normal text-end h-2"
        >
          {getStrengthText(strengthScore)}
        </span>
      </span>
    </FormDescription>
  )
}
