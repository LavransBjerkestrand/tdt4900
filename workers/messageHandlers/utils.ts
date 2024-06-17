export function wrapError(error: any): Error {
  return error instanceof Error ? error : new Error(error);
}
