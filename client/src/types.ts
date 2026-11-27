export type Board = {
    id: string;
    title: string;
    listIds: string[];
}

export type List = {
    id: string;
    title: string;
    cardIds: string[];
}

export type Card = {
    id: string;
    title: string;
    description?: string;
}

export type State = {
    boards: Record<string, Board>;
    lists: Record<string, List>;
    cards: Record<string, Card>;
}