export default defineI18nConfig(() => ({
  fallbackLocale: 'ja',
  legacy: false,
  locale: 'ja',
  numberFormats: {
    ja: {
      currency: {
        style: 'currency',
        currency: 'JPY',
        notation: 'standard',
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      percent: {
        style: 'percent',
        useGrouping: false,
      },
    },
  },
}));
