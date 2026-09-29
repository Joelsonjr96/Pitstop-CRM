'use client'
import { useState } from 'react'

export function KmInput({ name, placeholder, defaultValue, suffix = '' }: { name: string, placeholder: string, defaultValue?: string | number, suffix?: string }) {
    const [value, setValue] = useState(() => {
        if (!defaultValue) return ''
        return new Intl.NumberFormat('pt-BR').format(Number(defaultValue))
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value.replace(/\D/g, '')
        if (rawValue === '') {
            setValue('')
            return
        }

        // Format to thousands separator for display
        const formatted = new Intl.NumberFormat('pt-BR').format(parseInt(rawValue))
        setValue(formatted)
    }

    return (
        <div className="relative">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-md p-2 text-sm"
            />
            {suffix && <span className="absolute right-2 top-2 text-sm text-muted-foreground">{suffix}</span>}
            <input
                type="hidden"
                name={name}
                value={value.replace(/\D/g, '')}
            />
        </div>
    )
}
