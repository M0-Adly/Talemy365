export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export function success<T>(data: T): ActionResult<T> {
  return { success: true, data }
}

export function failure(error: string): ActionResult<never> {
  return { success: false, error }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}
