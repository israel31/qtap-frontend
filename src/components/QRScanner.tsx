'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      const codeReader = new BrowserQRCodeReader();
      codeReaderRef.current = codeReader;

      const videoInputDevices = await codeReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        setError('No camera found on this device');
        return;
      }

      // Use the first camera (usually back camera on mobile)
      const selectedDeviceId = videoInputDevices[0].deviceId;

      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result, error) => {
          if (result) {
            console.log('QR Code scanned:', result.getText());
            stopScanner();
            onScan(result.getText());
          }
          // Ignore errors, keep scanning
        }
      );
    } catch (err: any) {
      console.error('Scanner error:', err);
      setError(err.message || 'Unable to access camera. Please allow camera permissions.');
    }
  };

  const stopScanner = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Scan Driver QR Code</h2>
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="text-red-600 text-5xl mb-4">📷</div>
            <p className="text-red-600 mb-4 font-semibold">{error}</p>
            <p className="text-sm text-gray-600 mb-4">
              You can enter the driver ID manually instead
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const code = prompt('Enter driver ID (e.g., DRV-123456):');
                  if (code) {
                    onScan(code);
                  }
                }}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
              >
                Enter Manually
              </button>
              <button
                onClick={() => {
                  stopScanner();
                  onClose();
                }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 rounded-lg overflow-hidden border-4 border-primary-600 bg-black relative">
              <video
                ref={videoRef}
                className="w-full"
                style={{ maxHeight: '400px' }}
              />
              <div className="absolute inset-0">
                <div className="absolute inset-0 border-2 border-primary-400 m-16 animate-pulse"></div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2 font-semibold">
                📱 Position QR code in the frame
              </p>
              <p className="text-gray-500 text-xs mb-4">
                The scan will happen automatically
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const code = prompt('Or enter driver ID manually:');
                    if (code) {
                      stopScanner();
                      onScan(code);
                    }
                  }}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 text-sm"
                >
                  ⌨️ Type Instead
                </button>
                <button
                  onClick={() => {
                    stopScanner();
                    onClose();
                  }}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}