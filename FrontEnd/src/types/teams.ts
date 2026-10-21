export type Teams = {
    id: string
    name: string,
    description: string | null,
    active: boolean,
    _count?: {
        teamsMembers: number;
    }
}
