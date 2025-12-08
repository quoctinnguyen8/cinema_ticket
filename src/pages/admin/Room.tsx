import { useEffect, useState } from "react";
import { supabase } from "../../utils/appUtil";
import type { RoomListItem } from "../../types/room";
import { Modal } from "react-bootstrap";

function Room() {
    const [rooms, setRooms] = useState<RoomListItem[]>([]);

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

    const [roomName, setRoomName] = useState('')
    async function addRoom() {
        const res = await supabase.from('rooms').insert({room_name: roomName})

        if (res.status === 201) {
            loadRooms()
            setShow(false)
            setRoomName('')
        }
    }

    const [show, setShow] = useState(false)

    return (
        <>
            <h1>Danh sách phòng</h1>
            <div className="my-3">
                <button onClick={() => setShow(true)} className="btn btn-primary">Thêm phòng</button>
            </div>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Tên phòng</th>
                        <th></th>
                    </tr>
                    {rooms.map((room) => (
                        <tr key={room.id}>
                            <td>{room.id}</td>
                            <td>{room.room_name}</td>
                            <td>Sửa | Xóa</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Form thêm mới phòng */}
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <h4>Thêm mới phòng</h4>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mt-3">
                            <label className="form-label">Tên phòng</label>
                            <input type="text" className="form-control" 
                                value={roomName}
                                onChange={(ev) => setRoomName(ev.target.value)} />
                        </div>
                        <div className="mt-3">
                            <button type="button" onClick={addRoom} className="btn btn-success">
                                Thêm mới
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default Room;
