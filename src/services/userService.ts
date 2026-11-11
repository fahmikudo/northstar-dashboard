import type { TeamMember } from '@/types/user.types';

const members: TeamMember[] = [
  {
    id: 'tm_avery',
    name: 'Avery Chen',
    email: 'avery@northstar.dev',
    role: 'Product lead',
    weeklyCapacity: 32,
  },
  {
    id: 'tm_priya',
    name: 'Priya Raman',
    email: 'priya@northstar.dev',
    role: 'Engineering manager',
    weeklyCapacity: 24,
  },
  {
    id: 'tm_marcus',
    name: 'Marcus Webb',
    email: 'marcus@northstar.dev',
    role: 'Staff engineer',
    weeklyCapacity: 36,
  },
  {
    id: 'tm_dana',
    name: 'Dana Okafor',
    email: 'dana@northstar.dev',
    role: 'Product designer',
    weeklyCapacity: 30,
  },
  {
    id: 'tm_leo',
    name: 'Leo Martins',
    email: 'leo@northstar.dev',
    role: 'QA lead',
    weeklyCapacity: 34,
  },
];

export const userService = {
  list(): TeamMember[] {
    return members;
  },

  find(id: string): TeamMember | undefined {
    return members.find(member => member.id === id);
  },
};
