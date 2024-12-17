export const pauseTimer = (ms = 1000): Promise<void> =>
  new Promise((resolve) => setTimeout(() => resolve(), ms))
