export function mapSupabaseError(error: any) {
  console.error('Supabase error:', error)
  
  // Just wrap the error with additional context
  const wrappedError = new Error(error.message || 'Database operation failed')
  
  // Attach original error for debugging
  ;(wrappedError as any).originalError = error
  ;(wrappedError as any).code = error.code
  
  return wrappedError
}


