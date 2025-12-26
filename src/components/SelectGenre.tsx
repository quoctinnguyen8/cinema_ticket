import { useEffect, useState } from "react";
import { supabase } from "../utils/appUtil";

type SelectGenreProps = {
    selectedId?: number;
    onChange?: (genreId: number) => void;
};

function SelectGenre({selectedId, onChange}: SelectGenreProps) {
    const [genres, setGenres] = useState<{id: number, name: string}[]>([]);

    useEffect(() => {
        supabase.from('mst_film_genres')
        .select()
        .then(res => {
            if (!res.data) return;
            setGenres(res.data.map(i => ({
                id: i.id,
                name: i.name
            })))
        });
    }, []);

    return (
        <>
            <select onChange={(ev) => onChange && onChange(Number(ev.target.value))}
                className="form-select">
                <option>--Chọn 1 giá trị--</option>
                {genres.map(genre => (
                    <option key={genre.id} 
                        selected={selectedId === genre.id}
                        value={genre.id}
                    >{genre.name}</option>
                ))}
            </select>
        </>
    );
}

export default SelectGenre;
