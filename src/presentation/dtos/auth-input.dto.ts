import { z } from 'zod';

export const telephoneSchema = z.object({
    number: z.string().min(8).max(15),
    area_code: z.string().min(2).max(3),
});

export const signUpSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    telephones: z.array(telephoneSchema).min(1),
});

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

