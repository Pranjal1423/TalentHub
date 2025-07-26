// Currency formatting utilities
export const formatCurrency = (amount, currency = 'INR') => {
  if (!amount || amount === 0) return 'Salary not specified';
  
  // Format with Indian number system but without currency code
  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return `₹${formatter.format(amount)}`;
};

export const formatSalaryRange = (min, max, currency = 'INR') => {
  if (!min && !max) return 'Salary not specified';
  
  if (min && max) {
    return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
  }
  
  if (min) {
    return `From ${formatCurrency(min, currency)}`;
  }
  
  if (max) {
    return `Up to ${formatCurrency(max, currency)}`;
  }
  
  return 'Salary not specified';
};

export const parseCurrencyInput = (value) => {
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, '');
  
  // Convert to number
  const number = parseFloat(cleaned);
  
  // Return null if not a valid number
  return isNaN(number) ? null : number;
};

export const formatCurrencyInput = (value) => {
  if (!value) return '';
  
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, '');
  
  // Add commas for thousands
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}; 