export const validationRules = {
  url: {
    validate: (value: string): string | boolean => {
      if (!value.trim()) {
        return true
      }

      try {
        const urlObj = new URL(value)

        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          return 'URL must use HTTP or HTTPS protocol'
        }

        const pathname = urlObj.pathname.toLowerCase()
        if (!pathname.endsWith('.png')) {
          return 'URL must point to a PNG image'
        }

        return true
      } catch {
        return 'Invalid URL'
      }
    }
  }
}
