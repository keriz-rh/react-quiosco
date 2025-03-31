import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { categorias as categoriasDB } from '../data/categorias';
import clienteAxios from '../config/axios';


const QuioscoContext = createContext();

const QuioscoProvider = ({ children }) => {
    const [categorias, setCategorias] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState({});
    const [modal, setmodal] = useState(false);
    const [producto, setProducto] = useState({});
    const [pedido, setPedido] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const nuevoTotal = pedido.reduce((total, producto) => 
            (producto.precio * producto.cantidad) + total, 0)
        setTotal(nuevoTotal)
    }, [pedido])

    const obtenerCategorias = async () => {
        const token = localStorage.getItem('AUTH_TOKEN');
        try {
            const { data } = await clienteAxios('/api/categorias', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategorias(data.data);
            setCategoriaActual(data.data[0])
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(() => {
        obtenerCategorias();
    }, [])

    const handleClickCategoria = id => {
        const categoria = categorias.filter(categoria => categoria.id === id)[0]
        setCategoriaActual(categoria)
        console.log("Categoría actual:", categoria); // Verificar el valor
    }

    const handleClickModal = () => {
        setmodal(!modal)
    }

    const handleSetProducto = producto => {
        setProducto(producto)
    }

    const handleAgregarPedido = ({ categoria_id, ...producto }) => {
        if (pedido.some(pedidoState => pedidoState.id === producto.id)) {
            const pedidoActualizado = pedido.map(pedidoState =>
                pedidoState.id === producto.id ? { ...pedidoState, ...producto } : pedidoState
            );
            setPedido(pedidoActualizado)
            toast.success('Guardado correctamente')
        } else {
            setPedido([...pedido, producto])
            toast.success('Pedido agregado')
        }

    }

    const handEditarCantidad = id => {
        const productoActualizar = pedido.filter(producto => producto.id === id)[0]
        setProducto(productoActualizar)
        setmodal(!modal)
    }

    const handEliminarProductoPedido = id => {
        const pedidoActualizado = pedido.filter(producto => producto.id !== id)
        setPedido(pedidoActualizado)
        toast.success('Producto eliminado del pedido')
    }

    const handleSubmitNuevaOrder = async (logout) => {
        if (pedido.length === 0) {
            toast.error('No hay productos en el pedido');
            return;
        }
    
        const token = localStorage.getItem('AUTH_TOKEN');
    
        try {
            const { data } = await clienteAxios.post('/api/pedidos', { 
                total,
                productos: pedido.map(producto => {
                    return {
                        id: producto.id,
                        cantidad: producto.cantidad
                    }
                })
             }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success(data.message);
            setTimeout(() => {
            setPedido([]); // Limpiar pedido después de enviarlo si es necesario    
            }, 1000);

            // Cerrar la sesión dle usuario
            setTimeout(() => {
                localStorage.removeItem('AUTH_TOKEN');
                logout();
            }, 3000);

        } catch (error) {
            console.error('Error al enviar la orden:', error);
            toast.error('Hubo un error al enviar el pedido');
        }
    };
    
    const handleClickCompletarPedido = async id => {
        const token = localStorage.getItem('AUTH_TOKEN');
        try {
            await clienteAxios.put(`/api/pedidos/${id}`, null , {
                headers: { Authorization: `Bearer ${token}` }

            })
        } catch (error) {
            
        }
    }

    const handleClickProductoAgotado = async id => {
        const token = localStorage.getItem('AUTH_TOKEN');
        try {
            await clienteAxios.put(`/api/productos/${id}`, null , {
                headers: { Authorization: `Bearer ${token}` }

            })
        } catch (error) {
            
        }
    }

    return (
        <QuioscoContext.Provider
            value={{
                categorias,
                categoriaActual,
                handleClickCategoria,
                modal,
                handleClickModal,
                producto,
                handleSetProducto,
                pedido,
                handleAgregarPedido,
                handEditarCantidad,
                handEliminarProductoPedido,
                total,
                handleSubmitNuevaOrder,
                handleClickCompletarPedido,
                handleClickProductoAgotado
                

            }}
        >
            {children}
        </QuioscoContext.Provider>
    );
};

export { QuioscoProvider, QuioscoContext };
