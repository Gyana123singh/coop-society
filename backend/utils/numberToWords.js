/**
 * Indian Number System / Rupees to Words Converter
 * Converts numeric amounts (e.g., 4850.50) into words.
 */

const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const teenDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tensDigits = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const convertBelowThousand = (num) => {
  let str = '';
  if (num >= 100) {
    str += singleDigits[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  if (num >= 10 && num < 20) {
    str += teenDigits[num - 10] + ' ';
  } else {
    if (num >= 20) {
      str += tensDigits[Math.floor(num / 10)] + ' ';
      num %= 10;
    }
    if (num > 0) {
      str += singleDigits[num] + ' ';
    }
  }
  return str.trim();
};

const convertToWords = (amount) => {
  if (isNaN(amount) || amount === null || amount === undefined) return '';
  const num = parseFloat(amount);
  if (num === 0) return 'Zero Rupees Only';

  const parts = num.toFixed(2).split('.');
  let integerPart = parseInt(parts[0], 10);
  const decimalPart = parseInt(parts[1], 10);

  let result = '';

  // Indian Numbering System: Crores, Lakhs, Thousands, Hundreds
  if (Math.floor(integerPart / 10000000) > 0) {
    const crore = Math.floor(integerPart / 10000000);
    result += convertBelowThousand(crore) + ' Crore ';
    integerPart %= 10000000;
  }

  if (Math.floor(integerPart / 100000) > 0) {
    const lakh = Math.floor(integerPart / 100000);
    result += convertBelowThousand(lakh) + ' Lakh ';
    integerPart %= 100000;
  }

  if (Math.floor(integerPart / 1000) > 0) {
    const thousand = Math.floor(integerPart / 1000);
    result += convertBelowThousand(thousand) + ' Thousand ';
    integerPart %= 1000;
  }

  if (integerPart > 0) {
    result += convertBelowThousand(integerPart);
  }

  result = result.trim();
  let finalWords = result ? `${result} Rupees` : '';

  if (decimalPart > 0) {
    const paiseWords = convertBelowThousand(decimalPart);
    finalWords += finalWords ? ` and ${paiseWords} Paise` : `${paiseWords} Paise`;
  }

  return `${finalWords} Only`.trim();
};

module.exports = convertToWords;
