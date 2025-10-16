export interface ProblemDetails {
  type?: string
  title: string
  status: number
  detail?: string
  instance?: string
  errors?: Record<string, string[]>
}

export function createProblemDetails(
  status: number,
  title: string,
  detail?: string,
  errors?: Record<string, string[]>,
): ProblemDetails {
  return {
    status,
    title,
    detail,
    errors,
  }
}
