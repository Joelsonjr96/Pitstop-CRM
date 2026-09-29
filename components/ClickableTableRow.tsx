'use client'

import { useRouter } from 'next/navigation'

export function ClickableTableRow({ children, href, className, ...props }: { children: React.ReactNode, href: string, className?: string } & React.HTMLAttributes<HTMLTableRowElement>) {
  const router = useRouter()

  return (
    <tr
      {...props}
      className={`border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 cursor-pointer ${className}`}
      onClick={() => router.push(href)}
    >
      {children}
    </tr>
  )
}
