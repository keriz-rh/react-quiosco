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
        try {
            const { data } = await clienteAxios('/api/categorias');
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
                total

            }}
        >
            {children}
        </QuioscoContext.Provider>
    );
};

export { QuioscoProvider, QuioscoContext };
