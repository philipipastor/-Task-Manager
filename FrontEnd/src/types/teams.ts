export type Teams = {
    id: string
    name: string,
    description: string,
    _count?: {
        teamsMembers: number;
    }
}