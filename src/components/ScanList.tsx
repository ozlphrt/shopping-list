import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../i18n/context';
import { useItems } from '../hooks/useItems';
import { detectCategory } from '../utils/categoryDetector';
import './ScanList.css';

interface ScanListProps {
  onClose: () => void;
}

export const ScanList = ({ onClose }: ScanListProps) => {
  const { t } = useI18n();
  const { addItem } = useItems();
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera is not supported in this browser. Please use a modern browser or upload a photo instead.');
        return;
      }

      // Try to get camera with back camera preference, fallback to any camera
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment', // Use back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      } catch (backCameraError) {
        // Fallback to any available camera
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
        } catch (anyCameraError) {
          throw anyCameraError;
        }
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setIsScanning(true);
        };
      }
    } catch (err: any) {
      let errorMessage = t('scan.cameraError') || 'Could not access camera';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found. Please connect a camera or upload a photo instead.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints not supported. Trying with default settings...';
      } else {
        errorMessage = `Camera error: ${err.message || 'Unknown error'}`;
      }
      
      setError(errorMessage);
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      setPreview(imageData);
      stopCamera();
      processImage(imageData);
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        setError('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env.local file. See GET_OPENAI_KEY.md for instructions.');
        setIsProcessing(false);
        return;
      }

      setProcessingProgress(25);

      // Validate image data
      if (!imageData || !imageData.includes(',')) {
        setError('Failed to process image');
        setIsProcessing(false);
        return;
      }

      setProcessingProgress(50);

      // Use ChatGPT Vision API to extract shopping list items
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o', // or 'gpt-4-vision-preview'
          messages: [
            {
              role: 'system',
              content: 'You are a shopping list extraction assistant. Extract all shopping list items from the image. Return ONLY a JSON array of strings, where each string is a product name. Do not include quantities, prices, or other information - just the product names. If the image is not a shopping list or contains no items, return an empty array [].'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all shopping list items from this image. Return a JSON array of product names only.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageData
                  }
                }
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.1
        })
      });

      setProcessingProgress(75);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || 'Failed to process image with ChatGPT';
        
        // Create error with more context
        const error = new Error(errorMessage);
        (error as any).statusCode = response.status;
        (error as any).errorType = errorData.error?.type;
        throw error;
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '[]';
      
      setProcessingProgress(90);

      // Parse JSON response
      let items: string[] = [];
      try {
        // Try to extract JSON array from response (in case there's extra text)
        const jsonMatch = content.match(/\[.*\]/s);
        if (jsonMatch) {
          items = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: try to parse the whole response
          items = JSON.parse(content);
        }
      } catch (parseError) {
        // If JSON parsing fails, try to extract items from text
        // Split by common delimiters and clean up
        items = content
          .split(/[,\n•\-\*]/)
          .map((item: string) => item.trim().replace(/^[\d\.\-\s]+/, '').trim()) // Remove leading numbers/bullets
          .filter((item: string) => item.length > 0 && item.length < 100); // Filter valid items
      }

      // Filter and clean items
      const cleanedItems = items
        .map(item => item.trim())
        .filter(item => {
          if (item.length < 2) return false;
          if (/^\d+$/.test(item)) return false; // All numbers
          if (/^[^\w\s]+$/.test(item)) return false; // Only symbols
          return true;
        });

      setExtractedItems(cleanedItems);
      setProcessingProgress(100);
    } catch (err: any) {
      let errorMessage = t('scan.ocrError') || 'Failed to process image';
      
      // Check for specific OpenAI error types
      if (err.message?.includes('quota') || err.message?.includes('billing') || err.message?.includes('exceeded')) {
        errorMessage = 'OpenAI API quota exceeded. Please check your billing at https://platform.openai.com/account/billing. You may need to add a payment method or wait for quota reset.';
      } else if (err.message?.includes('401') || err.message?.includes('Invalid') || err.message?.includes('api key')) {
        errorMessage = 'Invalid API key. Please check your VITE_OPENAI_API_KEY in .env.local and restart the dev server.';
      } else if (err.message?.includes('429') || err.message?.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      // Only log to console, don't show raw error to user
      console.error('OCR error:', err);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setPreview(imageData);
      processImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const addExtractedItems = async () => {
    for (const itemName of extractedItems) {
      if (itemName.trim()) {
        const category = await detectCategory(itemName);
        await addItem({
          name: itemName.trim(),
          quantity: '',
          category,
          notes: '',
          picked: false,
          deleted: false,
          createdBy: ''
        });
      }
    }
    onClose();
  };

  return (
    <>
      <div className="scan-overlay" onClick={onClose}></div>
      <div className="scan-modal" onClick={(e) => e.stopPropagation()}>
        <div className="scan-header">
          <h3 className="scan-title">{t('scan.title') || 'Scan Shopping List'}</h3>
          <button onClick={onClose} className="scan-close">×</button>
        </div>

        {!isScanning && !preview && (
          <div className="scan-options">
            <button onClick={startCamera} className="scan-button scan-button-primary">
              <span className="material-symbols-outlined">camera</span>
              {t('scan.useCamera') || 'Use Camera'}
            </button>
            <label className="scan-button scan-button-secondary">
              <span className="material-symbols-outlined">photo</span>
              {t('scan.uploadPhoto') || 'Upload Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        )}

        {isScanning && (
          <div className="scan-camera">
            <video ref={videoRef} autoPlay playsInline className="scan-video"></video>
            <div className="scan-camera-controls">
              <button onClick={stopCamera} className="scan-button scan-button-secondary">
                {t('scan.cancel') || 'Cancel'}
              </button>
              <button onClick={captureImage} className="scan-button scan-button-primary">
                <span className="material-symbols-outlined">camera</span>
                {t('scan.capture') || 'Capture'}
              </button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="scan-processing">
            <div className="scan-spinner"></div>
            <p>{t('scan.processing') || 'Processing image...'}</p>
            {processingProgress > 0 && (
              <div className="scan-progress">
                <div className="scan-progress-bar" style={{ width: `${processingProgress}%` }}></div>
                <span>{processingProgress}%</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="scan-error">
            <p>{error}</p>
          </div>
        )}

        {preview && !isProcessing && (
          <div className="scan-preview">
            <img src={preview} alt="Captured" className="scan-preview-image" />
            {extractedItems.length > 0 ? (
              <div className="scan-items">
                <h4>{t('scan.extractedItems') || 'Extracted Items:'}</h4>
                <ul className="scan-items-list">
                  {extractedItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <div className="scan-actions">
                  <button onClick={() => { setPreview(null); setExtractedItems([]); }} className="scan-button scan-button-secondary">
                    {t('scan.rescan') || 'Rescan'}
                  </button>
                  <button onClick={addExtractedItems} className="scan-button scan-button-primary">
                    {t('scan.addItems') || 'Add Items'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="scan-no-items">
                <p>{t('scan.noItemsFound') || 'No items found. Try again with better lighting.'}</p>
                <button onClick={() => { setPreview(null); setExtractedItems([]); }} className="scan-button scan-button-secondary">
                  {t('scan.tryAgain') || 'Try Again'}
                </button>
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
    </>
  );
};

