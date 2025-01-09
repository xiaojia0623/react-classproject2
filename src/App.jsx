import { useState } from 'react'
import './styles/app.scss'
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [callProduct, setCallProduct] = useState({});
  const [products, setProducts] = useState([]);

  const [myAccount, setMyAccount] = useState({
    username:'email@example.com',
    password:'example'
  })

  const handleInputChange = (e) => {
    const {value, name} = e.target;
    setMyAccount({
      ...myAccount,
      [name]: value
    })
  }

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post(`${BASE_URL}/v2/admin/signin`, myAccount)
      .then((res) => {
        const {token, expired} = res.data;
        console.log(token, expired);
        document.cookie = `jojo123456=${token}; expires=${expired}`;
        //var myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)test2\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
        axios.defaults.headers.common['Authorization'] = token;
        axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`)
          .then((res) => setProducts(res.data.products))
          .catch((error) => console.log(error))
        setIsLogin(true);
      })
      .catch((error) => {
        console.log(error.data.message)
      })
  }

  const loginCheck = () => {
    axios.post(`${BASE_URL}/v2/api/user/check`)
      .then((res) => alert('使用者已登入'))
      .catch((error) => console.error(error))
  }

  return (
    <>
    {isLogin ? (<div className="container mt-5">
        <div className="row">
          <div className="col-6">
            <button onClick={loginCheck} type='button'className='btn btn-danger mb-3'>確認是否已登入</button>
            <h2 className='fw-bold'>產品列表</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">查看細節</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>$ {product.origin_price}</td>
                    <td>$ {product.price}</td>
                    <td>{product.is_enabled}</td>
                    <td><button onClick={() =>setCallProduct(product)} type="button" className="btn btn-primary">查看細節</button></td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-6"><h2 className='fw-bold'>單一產品細節</h2>
            {callProduct.title ? (<div className="card m-0 p-0">
              <img src={callProduct.imageUrl} className="card-img-top" alt={callProduct.title} />
              <div className="card-body  m-0 text-start">
                <h5 className="card-title">{callProduct.title} <span className='badge text-bg-primary'>{callProduct.category}</span></h5>
                <p className="card-text">商品描述: {callProduct.description}</p>
                <p className="card-text">商品內容: {callProduct.content}</p>
                <p className="card-text"><del>{callProduct.origin_price}</del> / {callProduct.price}</p>
                <h5 className="card-title">更多圖片:</h5>
                {callProduct.imagesUrl?.map((image, index) => {
                  return <img className='img-fluid' src={image} key={index}/>
                })}
              </div>
            </div>) : '請選擇一個產品查看細節'}
          </div>
        </div>
      </div>) : (<div className="login-page d-flex justify-content-evenly" >
      <div>
        <h1 className="mb-3 fw-bold">請先登入</h1>
        <form onSubmit={handleLogin} className="d-flex flex-column">
          <div className="mb-3 form-floating">
            <input name='username' value={myAccount.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="email@example.com"/>
            <label htmlFor="username">Email address</label>
          </div>
          <div className="mb-3 form-floating">
            <input name='password' value={myAccount.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password"/>
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-primary">登入</button>
        </form>
      </div>
      <div className='ms-5'>
        <img className='login-img' src="https://images.unsplash.com/photo-1529539795054-3c162aab037a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
      </div>
        
    </div>)}
    </>
  )
}

export default App
