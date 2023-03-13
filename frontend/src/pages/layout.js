import { useEffect } from "react";
import {Outlet, Link, useNavigate } from "react-router-dom";

function LayoutComponent() {
    const navigate = useNavigate();
    let isAdmin = false;

    const logout = () => {
        navigate("/login");
    }

    useEffect(()=> {
        if(!localStorage.getItem("token")){
            navigate("/login");
        }
    });

    const checkIsAdmin = () =>{
        let user = JSON.parse(localStorage.getItem("user"));
        isAdmin = user.isAdmin;
    }

    checkIsAdmin();

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand">E-Ticaret</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/">Ana Sayfa</Link>
                            </li> 
                            {
                            isAdmin &&
                            <li className="nav-item mx-2">
                                <Link to="/products">Ürünler</Link>
                            </li>                     
                            } 
                            <li className="nav-item mx-2">
                                <Link to="/orders">Siparişlerim</Link>
                            </li> 
                            <li className="nav-item mx-2">
                                <Link to="/baskets">Sepetim</Link>
                            </li>                            
                        </ul>
                        <button onClick={logout} className="btn btn-outline-danger" type="submit">Çıkış Yap</button>
                    </div>
                </div>
            </nav>

            <Outlet/>

        </>
    )
}

export default LayoutComponent;