const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

function getPasswordKey(password: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', ENCODER.encode(password), 'PBKDF2', false, ['deriveKey']);
}

function deriveKey(passwordKey: CryptoKey, salt: Uint8Array) {
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 1,
      hash: 'SHA-256',
    },
    passwordKey,
    {name: 'AES-GCM', length: 256},
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptData(data: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const passwordKey = await getPasswordKey(password);
  const aesKey = await deriveKey(passwordKey, salt);
  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    aesKey,
    ENCODER.encode(data),
  );

  let bytes = new Uint8Array([...salt, ...iv, ...new Uint8Array(encryptedContent)]);

  return bytesToHex(bytes);
}

export async function decryptData(data: string, password: string): Promise<string> {
  const bytes = hexToBytes(data);
  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 16 + 16);
  const encryptedData = bytes.slice(16 + 16);
  const passwordKey = await getPasswordKey(password);
  const aesKey = await deriveKey(passwordKey, salt);
  const decryptedBytes = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    aesKey,
    encryptedData,
  );
  return DECODER.decode(decryptedBytes);
}

export function bytesToHex(buffer: Uint8Array): string {
  return buffer.reduce((data, byte) => {
    const hex = byte.toString(16);
    const padded = hex.length === 1 ? `0${hex}` : hex;
    return `${data}${padded}`;
  }, '');
}

export function hexToBytes(hex: string): Uint8Array {
  const bytes = Array(hex.length)
    .fill(0)
    .map((_, i) => i)
    .filter(i => i % 2 === 0)
    .map(i => parseInt(`${hex[i]}${hex[i + 1]}`, 16));
  return new Uint8Array(bytes);
}
