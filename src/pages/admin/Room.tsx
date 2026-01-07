import { useEffect, useState } from "react";
import { supabase } from "../../utils/appUtil";
import type { Room as RoomType, RoomListItem } from "../../types/room";
import AppModal from "../../components/AppModal";
import { useForm } from "react-hook-form";

type RoomForm = {
    room_name: string;
}

function Room() {
    const [rooms, setRooms] = useState<RoomListItem[]>([]);

    const {
        formState: { errors },
        register,
        handleSubmit,
        setValue
       } = useForm<RoomForm>();

    async function loadRooms() {
        const { data, error } = await supabase.from("rooms").select();
        if (error) {
            alert("Xảy ra lỗi khi lấy dữ liệu. " + error);
            return;
        }
        setRooms(data as RoomListItem[]);
    }

    // Xử lý khi vừa tải trang xong
    useEffect(() => {
        loadRooms();
    }, []);

    // const [roomName, setRoomName] = useState('')
    async function upsertRoom(formData: RoomForm) {
        let res;
        if (roomId === 0) {
            res = await supabase.from('rooms').insert(formData)
        } else {
            res = await supabase.from('rooms').upsert({
                id: roomId,
                ...formData
            })
        }

        if (res.status === 201 || res.status === 200) {
            loadRooms()
            setShow(false)
            setValue("room_name", '')
        }
    }

    const [mHeader, setMHeader] = useState('');
    function showModal(headerText: string) {
        setMHeader(headerText)
        setShow(true)
        setValue("room_name", '')
        setRoomId(0)
    }

    const [roomId, setRoomId] = useState<number | null>()

    async function editRoom(id: number) {
        showModal('Sửa thông tin phòng');
        
        const {data, status} = await supabase.from("rooms").select().eq('id', id);
        if (status === 200 && data) {
            const room = (data as RoomType[])[0];
            if (room) {
                setValue("room_name", room.room_name ?? '')
                setRoomId(room.id)
            }
        }
    }

    async function deleteRoom(id: number) {
        const res = confirm("Bạn có chắc chắn muốn xóa phòng này không?")
        if (!res) return;
        const result = await supabase.from('rooms').delete().eq('id', id);
        if (result.status === 204) {
            loadRooms()
        }
    }

    const [show, setShow] = useState(false)

    const [checkedIds, setCheckedIds] = useState<number[]>()

    function addIdToList(id: number) {
        if (checkedIds) {
            setCheckedIds([...checkedIds, id])
        } else {
            setCheckedIds([id])
        }
    }
    function removeIdFromList(id: number) {
        const idx = checkedIds?.indexOf(id)
        if (!checkedIds) return;
        if (idx != undefined && idx >= 0) {
            setCheckedIds([
                ...checkedIds.slice(0, idx),
                ...checkedIds.slice(idx + 1)
            ])
        }
    }
    function handleCheck(isChecked: boolean, id: number) {
        if (isChecked) {
            addIdToList(id)
        } else {
            removeIdFromList(id)
        }
    }

    async function multipleDelete() {
        if (!checkedIds || checkedIds.length == 0) {
            alert("Chưa chọn dữ liệu cần xóa");
            return;
        }

        if (!confirm(`Xác nhận xóa ${checkedIds.length} phòng?`)){
            return
        }

        await supabase.from('rooms')
                .delete()
                .in('id', checkedIds)
        await loadRooms()

        // reset dữ liệu được chọn
        setCheckedIds([])
    }

    return (
        <>
            <h1>Danh sách phòng</h1>
            <div className="my-3">
                <button onClick={() => showModal('Thêm mới phòng')} className="btn btn-primary">Thêm phòng</button>
                <button onClick={multipleDelete} className="btn btn-outline-danger">Xóa hàng loạt</button>
            </div>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>ID</th>
                        <th>Tên phòng</th>
                        <th></th>
                    </tr>
                    {rooms.map((room, idx) => (
                        <tr key={room.id}>
                            <td>
                                <input type="checkbox"
                                    onChange={(ev) => handleCheck(ev.currentTarget.checked, room.id)} />
                            </td>
                            <td>{idx + 1}</td>
                            <td>{room.room_name}</td>
                            <td>
                                <button onClick={() => editRoom(room.id)} className="btn btn-info">Sửa</button> 
                                <button onClick={() => deleteRoom(room.id)} className="btn btn-danger">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Form thêm mới phòng */}
            <AppModal show={show} onHide={() => setShow(false)} headerText={mHeader}>
                <form onSubmit={handleSubmit(upsertRoom)}>
                    <div className="mt-3">
                        <label className="form-label">Tên phòng</label>
                        <input {...register("room_name", {required: true})} className="form-control" />
                        {errors.room_name?.type == "required" && 
                            <span className="text-danger d-inline-block mt-1">Tên phòng là bắt buộc</span>}
                    </div>
                    <div className="mt-3">
                        <button type="submit" className="btn btn-success">
                            Lưu
                        </button>
                    </div>
                </form>
            </AppModal>
        </>
    );
}
export default Room;
