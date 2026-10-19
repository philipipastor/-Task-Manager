export type TeamMember = {
  id: string;
  userId: string;
  teamId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};