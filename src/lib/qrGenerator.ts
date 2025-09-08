import QRCode from 'qrcode';

export interface QRData {
  id: string;
  name: string;
  email?: string;
  checkInTime: string;
  badgeNumber?: string;
  type: 'visitor' | 'employee';
}

export const generateQRCode = async (data: QRData): Promise<string> => {
  try {
    const qrString = JSON.stringify(data);
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const parseQRCode = (qrString: string): QRData | null => {
  try {
    return JSON.parse(qrString) as QRData;
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return null;
  }
};