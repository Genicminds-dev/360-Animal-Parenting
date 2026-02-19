// utils/formatUtils.js
export const formatDate = (dateString) => {
  if (!dateString) return "Not provided";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return dateString;
  }
};

export const formatSimpleDate = (dateString) => {
  if (!dateString) return "Not provided";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
};

export const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }
  return value;
};

export const formatYesNo = (value) => {
  return value === 'yes' ? 'Yes' : 'No';
};

export const formatBoolean = (value) => {
  return value ? 'Yes' : 'No';
};