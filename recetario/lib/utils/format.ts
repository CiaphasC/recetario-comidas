export function formatDecimal(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "0.00"
  }
  return value.toFixed(2)
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`
}

export function getCompletenessColor(percentage: number): string {
  if (percentage >= 100) return "text-success"
  if (percentage >= 50) return "text-warning"
  return "text-destructive"
}

export function getCompletenessBadgeVariant(percentage: number): "default" | "secondary" | "destructive" {
  if (percentage >= 100) return "default"
  if (percentage >= 50) return "secondary"
  return "destructive"
}
