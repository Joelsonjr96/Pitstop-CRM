import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeWords(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatPlate(plate: string): string {
  if (!plate) return ''
  const cleaned = plate.replace(/\W/g, '').toUpperCase()
  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
  }
  return cleaned
}

export function formatOilViscosity(oil: string): string {
  if (!oil) return ''
  // Regex to match viscosity patterns like 5w30, 10w40 at the start of string
  return oil.replace(/^(\d+w\d+)/i, (match) => match.toUpperCase())
    .split(' ')
    .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatPhone(phone: string) {
  const cleaned = ('' + phone).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return phone
}
