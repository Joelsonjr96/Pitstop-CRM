'use client'
import { useState } from 'react'

export function CurrencyInput({ name, placeholder, defaultValue }: { name: string, placeholder: string, defaultValue?: string | number }) {
    const [displayValue, setDisplayValue] = useState(() => {
        if (!defaultValue) return ''
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(defaultValue))
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value.replace(/\D/g, '')

        if (rawValue === '') {
            setDisplayValue('')
            return
        }

        // Convert to cents
        const cents = parseInt(rawValue)
        const value = cents / 100

        // Format to BRL currency
        const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
        setDisplayValue(formatted)
    }

    return (
        <div className="relative">
            <input
                type="text"
                placeholder={placeholder}
                value={displayValue}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-md p-2 text-sm pl-8"
            />
            <span className="absolute left-2 top-2 text-sm text-muted-foreground">R$</span>
            <input
                type="hidden"
                name={name}
                // Send value as decimal number
                value={(parseInt(displayValue.replace(/\D/g, '') || '0') / 100).toFixed(2)}
            />
        </div>
    )
}
