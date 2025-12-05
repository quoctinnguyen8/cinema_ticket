import { useState } from "react";
import { supabase } from "../../utils/appUtil";
import { useNavigate } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function registerUser() {
        if (!email || !password) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        const response = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        if (response.error) {
            alert('Đăng ký thất bại: ' + response.error.message);
        } else {
            alert('Đăng ký thành công!');
            navigate('/dang-nhap');
        }
    }

    return (
        <>
        <div className="row">
            <div className="col-md-6">
                <h2>Đăng ký tài khoản</h2>
                <form>
                    <div className="mb-3">
                        <label className="form-label">Địa chỉ mail</label>
                        <input type="email" className="form-control"
                            value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mật khẩu</label>
                        <input type="password" className="form-control"
                            value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="button" onClick={async () => await registerUser()} 
                        className="btn btn-primary">Đăng ký</button>
                </form>
            </div>
        </div>
        </>
    );
}

export default Register;