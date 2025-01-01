import { z } from 'zod';

export const characterFormSchema = z.object({
    name: z.string().min(1).max(20),
    class: z.enum(['Gladiolus', 'Saintpaulia', 'Cypress', 'Blackthorn']),
});

export const battleRoomFormSchema = z.object({
    roomName: z.string().min(1).max(50),
    description: z.string().max(100).optional(),
});
