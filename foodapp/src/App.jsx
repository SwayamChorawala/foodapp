
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './App.css'

import Home from './components/Home';
import Menu from './components/Menu/Menu'

import Explore from './components/Explore';
import About from './components/About/About';
import { LuALargeSmall, LuShoppingBag } from 'react-icons/lu';
import Card2 from './components/Menu/Card2';
import Contaxt from './context/Contaxt';
import OrderForm from './components/Menu/OrderForm';
import Login from './components/Login/Login';
import AdminPanel from './components/Admin/AdminPanel';

function App() {
  const router = createHashRouter([
    {
      path: '/',
      element: <Home /> 
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/admin',
      element: <AdminPanel />
    },
    {
      path: '/about',
      element: <About/>
    },
    {
       path: '/menu',
      element:<Menu/>
    },
    {
      path:'/contact',
      element:<Contaxt/>
    },
    {
      path: '/explore',
      element: <Explore />
    },
    {
      path: '/card2',
      element: <Card2 />
    },
    {
      path:"/orderform",
      element:<OrderForm/>
    }
  ]);

  return (
    <div>
      
      <RouterProvider router={router} />
    </div>
  )
}

export default App
