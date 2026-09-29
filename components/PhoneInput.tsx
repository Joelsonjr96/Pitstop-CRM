'use client'

import { useState } from 'react'

export function PhoneInput() {
    const [phone, setPhone] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length > 11) value = value.slice(0, 11)

        let masked = value
        if (value.length > 6) {
            masked = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`
        } else if (value.length > 2) {
            masked = `(${value.slice(0, 2)}) ${value.slice(2)}`
        } else if (value.length > 0) {
            masked = `(${value}`
        }
        setPhone(masked)
    }

    return (
        <input
            name="phone"
            id="phone"
            placeholder="(00) 00000-0000"
            required
            value={phone}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-md p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
    )
}
