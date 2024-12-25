import { z } from 'zod';

export const characterFormSchema = z.object({
    name: z.string().min(1).max(20),
    class: z.enum(['Gladiolus', 'Saintpaulia', 'Saffron', 'Cypress', 'Blackthorn']),
    skills: z.array(z.string()).min(3).max(3),
    attack: z.number().min(1),
    defense: z.number().min(1),
    maxHp: z.number().min(1),
    speed: z.number().min(1),
});
