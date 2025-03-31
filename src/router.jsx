import { createBrowserRouter } from 'react-router-dom'
import Authlayout from './layouts/Authlayout'
import Layout from './layouts/layout'
import Inicio from './views/Inicio'
import Login from './views/Login'
import Registro from './views/Registro'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Inicio />
            }
        ]
    },
    {
        path: "/auth", 
        element: <Authlayout />,
        children:[
            {
            path: '/auth/Login', 
            element: <Login />
            },
            {
                path: '/auth/Registro', 
                element: <Registro />
            }
        ]
    }
])

export default router