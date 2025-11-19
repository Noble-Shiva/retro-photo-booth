const QRCode = require('qrcode');

async function generateQRCode(data, options = {}) {
  const defaultOptions = {
    width: 300,
    margin: 2,
    color: {
      dark: '#2d1810',
      light: '#f5e6d3',
    },
    errorCorrectionLevel: 'M',
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const qrDataUrl = await QRCode.toDataURL(data, mergedOptions);
    return qrDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
}

async function generateQRBuffer(data, options = {}) {
  const defaultOptions = {
    width: 300,
    margin: 2,
    color: {
      dark: '#2d1810',
      light: '#f5e6d3',
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return QRCode.toBuffer(data, mergedOptions);
}

module.exports = { generateQRCode, generateQRBuffer };
