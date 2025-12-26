import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/appUtil";
import type { FilmListItem } from "../../types/film";

function Film() {
    const [listFilms, setListFilms] = useState<FilmListItem[]>();

    useEffect(() => {
        // Tải dữ liệu cần thiết
        supabase
            .from("films")
            .select(`
                id,
                name,
                thumbnail_url,
                mst_film_genres(name),
                mst_film_ratings(name),
                release_date
            `)
            .then((res) => {
                setListFilms(res.data as FilmListItem[]);
            });
    }, []);

    return (
        <>
            <h1>Trang danh sách phim</h1>
            <Link to="/admin/film/create" className="btn btn-primary">
                Thêm mới phim
            </Link>

            <table className="table table-bordered mt-3">
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Tên phim</th>
                        <th>Poster</th>
                        <th>Thể loại</th>
                        <th>Phân loại</th>
                        <th>Ngày chiếu</th>
                        <th></th>
                    </tr>
                    {/* Hiển thị danh sách */}
                    {listFilms?.map((film, idx) => (
                        <tr>
                            <td>{idx + 1}</td>
                            <td>{film.name}</td>
                            <td>
                                <img src={film.thumbnail_url} width="100" className="img-thumbnail" />
                            </td>
                            <td>{film.mst_film_genres?.name}</td>
                            <td>{film.mst_film_ratings?.name}</td>
                            <td>{film.release_date}</td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Film;
