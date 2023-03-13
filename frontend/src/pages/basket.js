import {useDebugValue, useEffect, useState} from 'react'
import axios from 'axios';

function BasketComponent(){
    const [baskets, setBaskets] = useState([]);
    const [total, setTotal] = useState(null);

    const getAll = async() =>{
        let user = JSON.parse(localStorage.getItem("user"));
        let model = {userId: user._id};
        let response = await axios.post("http://localhost:5000/baskets/getAll",model);
        setBaskets(response.data); 
        let totalC = 0;
        for (let i = 0; i < baskets.length; i++) {            
            totalC += baskets[i].products[0].price
        }
        setTotal(totalC);       
    }

    const remove = async(_id) => {
        let confirm = window.confirm("Sepetteki ürünü silmek istiyor musunuz?")
        if(confirm){
        let model = {_id: _id};
        await axios.post("http://localhost:5000/baskets/remove",model);
        getAll();       
        }
    }

    const addOrder = async () => {
        let user = JSON.parse(localStorage.getItem("user"));
        let model = {userId: user._id};
        await axios.post("http://localhost:5000/orders/add", model);
        getAll();
    }
   
    useEffect(()=>{
        getAll();
    })

    return(
        <>
        <div className='container mt-4'>
            <div className='card'>
                <div className="card-header">
                    <h1 className='text-center'>Sepetteki Ürünler</h1>
                </div>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-8'>
                            <table className='table table-bordered table-hover'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Ürün Adı</th>
                                        <th>Ürün Resmi</th>
                                        <th>Ürün Adedi</th>
                                        <th>Birim Fiyatı</th>
                                        <th>İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {baskets.map((basket,index)=>(
                                        <tr key={index}>
                                            <td>{index +1}</td>
                                            <td>{basket.products[0].name}</td>
                                            <td>
                                                <img src={"http://localhost:5000/" + basket.products[0].imageUrl} width="75"/>
                                            </td>
                                            <td>1</td>
                                            <td>{basket.products[0].price}</td>
                                            <td>
                                                <button onClick={()=> remove(basket._id)} className='btn btn-outline-danger btn-sm'>Sil</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                        <div className='col-md-4'>
                            <div className='card'>
                                <div className='card-header'>
                                    <h4 className='text-center'>Sepet Toplamı</h4>  
                                        <hr/>
                                        <h5 className='text-center'>Toplam Ürün Sayısı: {baskets.length}</h5>
                                        <h5 className='alert alert-danger text-center'>Toplam Tutar: {total}</h5>
                                    <hr/>
                                    <button type='button' onClick={addOrder} className='btn btn-outline-danger w-100'>Ödeme Yap</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default BasketComponent;