export function isFieldSuccess(fieldState, value) {
  const filled = value != null && String(value).trim() !== '';
  return Boolean(fieldState?.isTouched && !fieldState?.invalid && filled);
}
