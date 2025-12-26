import { useRef, useState } from "react"
import type { FilmType } from "../../types/film";
import { supabase } from "../../utils/appUtil";
import SelectGenre from "../../components/SelectGenre";
import SelectRating from "../../components/SelectRating";
import { useNavigate } from "react-router-dom";

function FilmUpsert() {
    const [filmName, setFilmName] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [genreId, setGenreId] = useState<number>();
    const [ratingId, setRatingId] = useState<number>();
    const [releaseDate, setReleaseDate] = useState('');
    const [isShowing, setIsShowing] = useState(false);

    const thumbnailRef = useRef<HTMLInputElement>(null);
    const trailerRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        let thumbnailUrl = '', trailerUrl = '';

        ev.preventDefault();
        // upload hình ảnh lên supabase storage
        const thumbnails = thumbnailRef.current?.files;
        if (thumbnails && thumbnails.length > 0) {
            const file = thumbnails[0];
            const res = await supabase.storage
                .from('cinema_ticket')
                .upload(`thumbnails/${Date.now()}-${file.name}`, file);
            if (res.data) {
                const url = supabase.storage.from('cinema_ticket').getPublicUrl(res.data.path)
                thumbnailUrl = url.data.publicUrl
            }
        }
        // upload trailer lên supabase storage
        const trailers = trailerRef.current?.files;
        if (trailers && trailers.length) {
            const file = trailers[0];
            const res = await supabase.storage
                .from('cinema_ticket')
                .upload(`trailers/${Date.now()}-${file.name}`, file);
            if (res.data) {
                const url = supabase.storage.from('cinema_ticket').getPublicUrl(res.data.path)
                trailerUrl = url.data.publicUrl
            }
        }

        // gửi dữ liệu lên supabase
        const data: FilmType = {
            name: filmName,
            director: director,
            thumbnail_url: thumbnailUrl,
            trailer_url: trailerUrl,
            description: description,
            genre_id: genreId,
            rating_id: ratingId,
            release_date: releaseDate,
            is_showing: isShowing,
        }
        const res = await supabase.from("films").insert(data);
        if (res.status === 201) {
            // chuyển hướng về trang danh sách phim
            navigate('/admin/film')
        }
    }
    return (
        <>
        <form onSubmit={handleSubmit}>
            <div className="mt-3">
                <label className="form-label">name</label>
                <input onChange={(ev)=>setFilmName(ev.target.value)} type="text" className="form-control" />
            </div>
            <div className="mt-3">
                <label className="form-label">director</label>
                <input onChange={(ev)=>setDirector(ev.target.value)} type="text" className="form-control" />
            </div>
            <div className="mt-3">
                <label className="form-label">thumbnail_url</label>
                <input ref={thumbnailRef} type="file" className="form-control" />
            </div>
            <div className="mt-3">
                <label className="form-label">trailer_url</label>
                <input ref={trailerRef} type="file" className="form-control" />
            </div>
            <div className="mt-3">
                <label className="form-label">description</label>
                <input onChange={(ev)=>setDescription(ev.target.value)} type="text" className="form-control" />
            </div>
            <div className="mt-3">
                <label className="form-label">genre_id</label>
                <SelectGenre onChange={setGenreId} />
            </div>
            <div className="mt-3">
                <label className="form-label">rating_id</label>
                <SelectRating onChange={setRatingId} />
            </div>
            <div className="mt-3">
                <label className="form-label">release_date</label>
                <input onChange={(ev)=>setReleaseDate(ev.target.value)} type="date" className="form-control" />
            </div>
            <div className="mt-3">
                <label className="form-label">is_showing</label>
                <input onChange={(ev)=>setIsShowing(ev.target.checked)} type="checkbox" className="form-check" />
            </div>

            <div className="mt-3">
                <input type="submit" value="Thêm thông tin phim" />
            </div>
        </form>
        </>
    );
}

export default FilmUpsert