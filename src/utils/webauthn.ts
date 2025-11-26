/**
 * WebAuthn utility for FaceID/TouchID support
 */

export const isWebAuthnAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.PublicKeyCredential !== 'undefined' &&
         typeof navigator.credentials !== 'undefined' &&
         typeof navigator.credentials.create !== 'undefined';
};

export const isBiometricAvailable = async (): Promise<boolean> => {
  if (!isWebAuthnAvailable()) return false;
  
  try {
    // Check if platform authenticator (biometric) is available
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return false;
  }
};

export const createBiometricCredential = async (userId: string, userEmail: string): Promise<PublicKeyCredential | null> => {
  if (!isWebAuthnAvailable()) {
    throw new Error('WebAuthn is not available in this browser');
  }

  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Get the domain for WebAuthn (remove port for localhost, use hostname for production)
    const rpId = window.location.hostname === 'localhost' 
      ? 'localhost' 
      : window.location.hostname.replace(/^www\./, ''); // Remove www if present
    
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'Shopping List',
        id: rpId,
      },
      user: {
        id: new TextEncoder().encode(userId),
        name: userEmail,
        displayName: userEmail,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Use platform authenticator (FaceID/TouchID)
        userVerification: 'required',
      },
      timeout: 60000,
      attestation: 'direct',
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    }) as PublicKeyCredential | null;

    return credential;
  } catch (error: any) {
    console.error('Error creating biometric credential:', error);
    if (error.name === 'NotAllowedError') {
      throw new Error('Biometric authentication was cancelled or not available');
    }
    throw error;
  }
};

export const authenticateWithBiometric = async (credentialId: string): Promise<PublicKeyCredential | null> => {
  if (!isWebAuthnAvailable()) {
    throw new Error('WebAuthn is not available in this browser');
  }

  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Get the domain for WebAuthn (remove port for localhost, use hostname for production)
    const rpId = window.location.hostname === 'localhost' 
      ? 'localhost' 
      : window.location.hostname.replace(/^www\./, ''); // Remove www if present
    
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials: [
        {
          id: Uint8Array.from(atob(credentialId), c => c.charCodeAt(0)),
          type: 'public-key',
        },
      ],
      rpId: rpId,
      userVerification: 'required',
      timeout: 60000,
    };

    const credential = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    }) as PublicKeyCredential | null;

    return credential;
  } catch (error: any) {
    console.error('Error authenticating with biometric:', error);
    if (error.name === 'NotAllowedError') {
      throw new Error('Biometric authentication was cancelled');
    }
    throw error;
  }
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

