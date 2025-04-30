import { AxiosError } from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const onError = (error: AxiosError | Error | string) => {
  const errorMessage =
    error instanceof AxiosError &&
    typeof error.response?.data?.message === 'string'
      ? error.response.data.message
      : error instanceof AxiosError &&
          Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(', ')
        : 'Something went wrong!'
  toast.error(errorMessage)
}
