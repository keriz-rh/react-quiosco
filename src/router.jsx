import { createBrowserRouter } from 'react-router-dom'
import Authlayout from './layouts/Authlayout'
import Layout from './layouts/layout'
import Inicio from './views/Inicio'
import Login from './views/Login'
import Registro from './views/Registro'
import AdminLayout from './layouts/AdminLayout'
import Ordenes from './views/Ordenes'
import Productos from './views/Productos'

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
                path: "login",  
                element: <Login />
            },
            {
                path: "registro",  
                element: <Registro />
            }
        ]
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Ordenes />
            },
            {
                path: "productos",  
                element: <Productos />
            }
        ]
    }
])

export default router
