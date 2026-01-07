import { useRef, useState } from "react"
import type { FilmType } from "../../types/film";
import { supabase } from "../../utils/appUtil";
import SelectGenre from "../../components/SelectGenre";
import SelectRating from "../../components/SelectRating";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type FilmFormType = {
    name: string;
    director?: string;
    thumbnail_url: FileList;
    trailer_url?: FileList;
    description?: string;
    genre_id: number;
    rating_id: number;
    release_date: string;
    is_showing: boolean;
}

const schema = yup.object({
    name: yup.string().required('Tên phim là bắt buộc'),
    director: yup.string(),
    thumbnail_url: yup.mixed()
        .test('fileRequired', 'Ảnh poster là bắt buộc', (value, ctx) => {
            const files = value as FileList
            return files.length > 0
        })
        .test('fileType', 'Ảnh poster không hợp lệ', (value, ctx) => {
            const files = value as FileList
            if (files.length == 0) return true;

            const file = files[0]
            // lấy extension
            const fileExt = file.name.split('.').pop()
            return ['jpg', 'jpeg', 'png'].includes(fileExt ?? '')
        }),
    trailer_url: yup.mixed().test('trailerMaxlength', 'Kích thước trailer không được vượt quá 5MB', (value, ctx) => {
        const files = value as FileList
        if (files.length == 0) return true;

        const file = files[0]
        return (file.size / 1024 / 1024) <= 5.00;
    }),
    description: yup.string(),
    genre_id: yup.number().min(1).required('Thể loại film là bắt buộc'),
    rating_id: yup.number().min(1).required('Xếp hạng phim là bắt buộc'),
    release_date: yup.string().required('Ngày phát hành là bắt buộc'),
    is_showing: yup.boolean()
}).required();

function FilmUpsert() {

    const navigate = useNavigate();

    async function handleSubmitForm(fData: any) {       
        let thumbnailUrl = '', trailerUrl = '';

        // upload hình ảnh lên supabase storage
        const thumbnails = fData.thumbnail_url;
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
        const trailers = fData.trailer_url;
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
            name: fData.name,
            director: fData.director,
            thumbnail_url: thumbnailUrl,
            trailer_url: trailerUrl,
            description: fData.description,
            genre_id: fData.genre_id,
            rating_id: fData.rating_id,
            release_date: fData.release_date,
            is_showing: fData.is_showing,
        }
        const res = await supabase.from("films").insert(data);
        if (res.status === 201) {
            // chuyển hướng về trang danh sách phim
            navigate('/admin/film')
        }
    }

    const {
        handleSubmit,
        register,
        control,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema)
    })

    return (
        <>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="mt-3">
                <label className="form-label">name</label>
                <input {...register('name')} type="text" className="form-control" />
                <p className="text-danger">{errors.name?.message}</p>
            </div>
            <div className="mt-3">
                <label className="form-label">director</label>
                <input {...register('director')} type="text" className="form-control" />
                <p className="text-danger">{errors.director?.message}</p>
            </div>
            <div className="mt-3">
                <label className="form-label">thumbnail_url</label>
                <input {...register('thumbnail_url')} type="file" className="form-control" />
                <p className="text-danger">{errors.thumbnail_url?.message}</p>
            </div>
            <div className="mt-3">
                <label className="form-label">trailer_url</label>
                <input {...register('trailer_url')} type="file" className="form-control" />
                <p className="text-danger">{errors.trailer_url?.message}</p>
            </div>
            <div className="mt-3">
                <label className="form-label">description</label>
                <input {...register('description')} type="text" className="form-control" />
                <p className="text-danger">{errors.description?.message}</p>
            </div>
            <div className="mt-3">
                <label className="form-label">genre_id</label>
                <Controller 
                    name="genre_id"
                    control={control}
                    render={({field}) => (
                        <SelectGenre onChange={field.onChange} />
                    )}
                />
                <p className="text-danger">{errors.genre_id?.message}</p>
            </div>
            <div className="mt-3">
                <label className="form-label">rating_id</label>
                <Controller
                    name="rating_id"
                    control={control}
                    render={({field}) => (<SelectRating onChange={field.onChange} />)}
                />
                <p className="text-danger">{errors.rating_id?.message}</p>
            </div>
            <div className="mt-3">
                <label className="form-label">release_date</label>
                <input {...register('release_date')} type="date" className="form-control" />
                <p className="text-danger">{errors.release_date?.message}</p>
            </div>
            <div className="mt-3">
                <label className="form-label">is_showing</label>
                <input {...register('is_showing')} type="checkbox" className="form-check" />
                <p className="text-danger">{errors.is_showing?.message}</p>
            </div>

            <div className="mt-3">
                <input type="submit" value="Thêm thông tin phim" />
            </div>
        </form>
        </>
    );
}

export default FilmUpsert