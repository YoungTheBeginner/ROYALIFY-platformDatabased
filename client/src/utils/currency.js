const formatterCache = new Map();

function getFormatter(locale = 'en-US', currency = 'USD') {
  const key = `${locale}-${currency}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));
  }
  return formatterCache.get(key);
}

export function formatCurrency(amountInMinorUnits, { currency = 'USD', locale = 'en-US' } = {}) {
  if (typeof amountInMinorUnits !== 'number' || Number.isNaN(amountInMinorUnits)) {
    return getFormatter(locale, currency).format(0);
  }

  return getFormatter(locale, currency).format(amountInMinorUnits / 100);
}

export function formatIntegerWithThousands(amount, { locale = 'en-US' } = {}) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return new Intl.NumberFormat(locale).format(0);
  }
  return new Intl.NumberFormat(locale).format(amount);
}
