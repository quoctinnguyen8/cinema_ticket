export type Room = {
    id: number;
    room_name?: string;
    created_at?: string;
    created_by?: string;
}

export type RoomListItem = {
    idx?: number;
} & Room;