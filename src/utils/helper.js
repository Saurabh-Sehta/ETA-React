import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
}

export const addThousandsSeperator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
}

export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    category: item?.category,
    amount: item?.amount,
  }));

  return chartData;
}

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format('Do MMM'),
    amount: item?.amount,
    source: item?.source,
  }))

  return chartData;
}

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format('Do MMM'),
    amount: item?.amount,
    category: item?.cataegory,
  }))

  return chartData;
}

export const prepareSummaryBarChartData = (data = []) => {

  if (!Array.isArray(data)) return [];

  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Sort by Year → Month (descending)
  const sortedData = [...data].sort((a, b) => {
    if (a.year === b.year) {
      return b.month - a.month;   
    }
    return b.year - a.year;      
  });

  return sortedData.map((item) => ({
    monthYear: `${MONTHS[item.month - 1]} ${item.year}`,
    totalIncome: Number(item.totalIncome) || 0,
    totalExpense: Number(item.totalExpense) || 0,
    totalBalance: Number(item.totalBalance) || 0,
  }));
};