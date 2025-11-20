import { ReactNode } from 'react'
import { useAuth } from '~/hooks/use-auth'

type ProtectedContentProps = {
  children?: ReactNode
  predicate: boolean | (() => boolean)
  fallback?: ReactNode
}

export const ProtectedContent = ({
  children,
  predicate,
  fallback = null,
}: ProtectedContentProps) => {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const shouldShowContent = () => {
    if (typeof predicate === 'function') return predicate()
    return predicate
  }

  return shouldShowContent() ? children : fallback
}
