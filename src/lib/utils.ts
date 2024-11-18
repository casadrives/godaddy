import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'EUR', locale = 'fr-LU') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string, locale = 'fr-LU') {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function formatDistance(meters: number, locale = 'fr-LU') {
  const kilometers = meters / 1000
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: kilometers >= 1 ? 'kilometer' : 'meter',
    unitDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(kilometers >= 1 ? kilometers : meters)
}

export function formatDuration(minutes: number, locale = 'fr-LU') {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'minute',
    unitDisplay: 'long',
  }).format(minutes)
}

export function generatePassword(length = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}