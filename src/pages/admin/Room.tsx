import { useEffect } from "react";
import { supabase } from "../../utils/appUtil";

function Room() {

    async function loadRooms() {
        const {data, error} = await supabase.from('rooms').select();
        if (error) {
            alert('Xảy ra lỗi khi lấy dữ liệu. ' + error);
            return;
        }
        console.log(data);
    }

    // Xử lý khi vừa tải trang xong
    useEffect(() => {
        loadRooms()
    }, []);

    return (
        <h1>Đây là trang Room</h1>
    )
}
export default Room;