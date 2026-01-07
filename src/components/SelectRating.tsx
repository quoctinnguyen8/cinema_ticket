import { useEffect, useState } from "react";
import { supabase } from "../utils/appUtil";

type SelectRatingProps = {
    selectedId?: number;
    onChange?: (genreId: number) => void;
};

function SelectRating({selectedId, onChange}: SelectRatingProps) {
    const [ratings, setRatings] = useState<{id: number, name: string}[]>([]);

    useEffect(() => {
        supabase.from('mst_film_ratings')
        .select()
        .then(res => {
            if (!res.data) return;
            setRatings(res.data.map(i => ({
                id: i.id,
                name: i.name
            })))
        });
    }, []);

    return (
        <>
            <select value={selectedId} onChange={(ev) => onChange && onChange(Number(ev.target.value))}
                className="form-select">
                <option value={0}>--Chọn 1 giá trị--</option>
                {ratings.map(rating => (
                    <option key={rating.id} 
                        value={rating.id}
                    >{rating.name}</option>
                ))}
            </select>
        </>
    );
}

export default SelectRating;
