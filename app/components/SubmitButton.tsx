'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton({ children, pendingText }: { children: React.ReactNode, pendingText: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-rose-600 hover:bg-rose-700 text-white font-semibold w-full h-11 rounded-md transition-colors ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {pending ? pendingText : children}
    </button>
  )
}
