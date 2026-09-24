import {z} from 'zod';
export const joinSchema=z.object({pin:z.string().regex(/^\d{6}$/),nickname:z.string().trim().min(1).max(24).regex(/^[\p{L}\p{N} _-]+$/u)});
export const answerSchema=z.object({sessionId:z.string().min(1),playerId:z.string().min(1),questionId:z.string().min(1),optionId:z.string().min(1)});
