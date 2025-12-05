import { useState } from "react";
import { supabase } from "../../utils/appUtil";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function loginUser() {
        const result = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (result.error) {
            alert("Đăng nhập thất bại: " + result.error.message);
        } else {
            alert("Đăng nhập thành công!");
            navigate("/admin/room");
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    <h2>Đăng nhập</h2>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Địa chỉ mail</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={async () => await loginUser()}
                            className="btn btn-primary"
                        >
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
