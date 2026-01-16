import 'server-only';
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const ivLength = 12;
const tagLength = 16;

const getKey = () => {
  const rawKey = process.env.APP_ENCRYPTION_KEY;
  if (!rawKey) {
    return null;
  }

  return crypto.createHash('sha256').update(rawKey).digest();
};

const toBase64Url = (buffer: Buffer) =>
  buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const fromBase64Url = (value: string) => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + '='.repeat(padLength), 'base64');
};

export const isEncryptionEnabled = () => Boolean(getKey());

export const encryptParam = (plainText: string) => {
  const key = getKey();
  if (!key) {
    return plainText;
  }

  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return toBase64Url(Buffer.concat([iv, tag, encrypted]));
};

export const decryptParam = (token: string) => {
  const key = getKey();
  if (!key) {
    return token;
  }

  const data = fromBase64Url(token);
  const iv = data.subarray(0, ivLength);
  const tag = data.subarray(ivLength, ivLength + tagLength);
  const encrypted = data.subarray(ivLength + tagLength);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
};
