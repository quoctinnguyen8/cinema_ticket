export type FilmType = {
    name: string;
    director?: string;
    thumbnail_url?: string;
    trailer_url?: string;
    description?: string;
    genre_id?: number;
    rating_id?: number;
    release_date?: string;
    is_showing?: boolean;
}

export type FilmListItem = {
    id: string;
    name: string;
    thumbnail_url?: string;
    mst_film_genres?: {
        name?: string;
    }
    mst_film_ratings?: {
        name?: string;
    }
    release_date?: string;
}