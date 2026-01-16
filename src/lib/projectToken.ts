import 'server-only';
import { decryptParam, encryptParam } from '@/lib/crypto';

export const encodeProjectToken = (projectId: string) => {
  return encryptParam(projectId);
};

export const decodeProjectToken = (token: string) => {
  try {
    return decryptParam(token);
  } catch (error) {
    console.error('Failed to decrypt project token', error);
    return token;
  }
};
