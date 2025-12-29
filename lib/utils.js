import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined) return '-';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${parseFloat(amount).toFixed(2)}`;
  }
}

export function formatNumber(number, decimals = 0) {
  if (number === null || number === undefined) return '-';
  
  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return parseFloat(number).toFixed(decimals);
  }
}

export function formatDate(date, format = 'short') {
  if (!date) return '-';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    
    if (format === 'short') {
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } else if (format === 'long') {
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (format === 'month') {
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    }
    
    return d.toLocaleDateString('en-US');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
}

export function formatMonth(date) {
  if (!date) return '-';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  } catch (error) {
    console.error('Error formatting month:', error);
    return '-';
  }
}

export function calculatePercentageChange(oldValue, newValue) {
  if (!oldValue || oldValue === 0) return null;
  
  const change = ((newValue - oldValue) / oldValue) * 100;
  return parseFloat(change.toFixed(2));
}

export function getInitials(name) {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function truncate(str, length = 50) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function downloadCSV(data, filename) {
  try {
    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CSV:', error);
    throw error;
  }
}

export function exportToJSON(data, filename) {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw error;
  }
}

export function getStockStatus(currentStock, criticalLevel) {
  if (!currentStock || !criticalLevel) return 'unknown';
  
  if (currentStock < criticalLevel) return 'critical';
  if (currentStock < criticalLevel * 1.5) return 'low';
  return 'healthy';
}

export function getCreditRiskStatus(balance, riskLimit) {
  if (!balance || !riskLimit) return 'safe';
  
  const percentage = (balance / riskLimit) * 100;
  
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 80) return 'warning';
  return 'safe';
}

export function sortByKey(array, key, direction = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function filterBySearchTerm(items, searchTerm, fields) {
  if (!searchTerm || !searchTerm.trim()) return items;
  
  const term = searchTerm.toLowerCase().trim();
  
  return items.filter(item => {
    return fields.some(field => {
      const value = item[field];
      if (!value) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
}