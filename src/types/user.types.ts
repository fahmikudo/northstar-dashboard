export type MemberRole =
  | 'Product lead'
  | 'Engineering manager'
  | 'Staff engineer'
  | 'Product designer'
  | 'QA lead';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  weeklyCapacity: number;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}
