import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

//npm i nodemon express express-formidable jsonwebtoken multer mongoose express-async-handler dotenv cors cookie-parser concurrently bcryptjs passport passport-google-oauth20 cookie-session
//npm i slick-carousel react-slick react-toastify react-router react-router-dom react-redux react-icons apexcharts react-apexcharts moment flowbite axios @reduxjs/toolkit @paypal/react-paypal-js

import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import Root from './components/Root';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Cookies from 'js-cookie';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/password/ForgotPassword'
import ResetPassword from './pages/password/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Profile from './pages/users/Profile';
import RefreshToken from './pages/auth/RefreshToken';
import { useGetProductsQuery } from './redux/features/products/productsApiSlice';
import Cart from './pages/cart/Cart';
import Favorite from './pages/favourite/Favourite';
import Shop from './pages/shop/Shop';
import SingleProduct from './pages/singleProduct/SingleProduct';
import Checkout from './pages/checkout/Checkout';
import { useSelector } from 'react-redux';
import MyOrders from './pages/users/MyOrders';

function App() {

  const accessToken = Cookies.get('accessToken') ? Cookies.get('accessToken') : null;
  const jwt = Cookies.get('jwt') ? Cookies.get('jwt') : null;
  const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null
  console.log(userInfo)

  const { data: products, refetch: refetchProducts } = useGetProductsQuery();
  const cartItmes = useSelector(state => state.cart.cartItems)



  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Root />}>
      <Route index element={<Home />} />
      <Route path='auth'>
        <Route path='login' element={accessToken && userInfo.isVerified ?
          <Navigate to={'/'} replace /> : <Login />} />
        <Route path='register' element={accessToken && userInfo.isVerified ?
          <Navigate to={'/'} replace /> : <Register />} />
        <Route path='verify/:id/:accessToken' element={<VerifyEmail />} />
      </Route>
      <Route path='password'>
        <Route path='forgot' element={<ForgotPassword />} />
        <Route path={`reset/:id/:accessToken`} element={<ResetPassword />} />
      </Route>
      <Route path='users'>
        <Route path='profile' element={
          accessToken && userInfo.isVerified ? <Profile /> : <Navigate to={'/auth/login'} replace />
        } />
        <Route path='myOrders' element={
          accessToken && userInfo.isVerified ? <MyOrders /> : <Navigate to={'/auth/login'} replace />
        }  />
      </Route>
      <Route path='cart' element={<Cart />} />
      <Route path='favourite' element={<Favorite />} />
      <Route path='shop' element={<Shop />} />
      <Route path='product/:id' element={<SingleProduct />} />
      <Route path='checkout' element={accessToken && userInfo.isVerified ? cartItmes.length > 0 ? <Checkout /> : <Navigate to={'/shop'} replace /> : <Navigate to={'/auth/login'} replace />} />


      {/* make the email be unique if we edit it in the usersList or updateProfile */}

    </Route>
  ));


  return <>
    {jwt && <RefreshToken />}
    <RouterProvider router={router} />
  </>
}

export default App;
