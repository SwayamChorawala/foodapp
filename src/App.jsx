
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'

import Home from './components/Home';
import Menu from './components/Menu/Menu'

import Explore from './components/Explore';
import About from './components/about/About';
import { LuALargeSmall, LuShoppingBag } from 'react-icons/lu';
import Card2 from './components/Menu/Card2';
import Contaxt from './context/Contaxt';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home /> 
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
    }
  ]);

  return (
    <div>
      
      <RouterProvider router={router} />
    </div>
  )
}

export default App
