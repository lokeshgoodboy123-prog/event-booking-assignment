// Currency Conversion Utility
// Exchange rate: 1 USD = 83 INR (approximately)
const USD_TO_INR_RATE = 83;

export const convertToINR = (priceInUSD) => {
  if (!priceInUSD) return 0;
  return Math.round(priceInUSD * USD_TO_INR_RATE);
};

export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPrice = (priceInUSD) => {
  const priceInINR = convertToINR(priceInUSD);
  return formatINR(priceInINR);
};

export default { convertToINR, formatINR, formatPrice };
