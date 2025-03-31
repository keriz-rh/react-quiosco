import useSWR from "swr";
import clienteAxios from "../config/axios";
import { formatearDinero } from '../helpers'
import useQuiosco from '../hooks/useQuiosco'


function Ordenes() {

    const token = localStorage.getItem('AUTH_TOKEN');
    const fetcher = () => clienteAxios('/api/pedidos', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(res => res.data); // Asegurar que devuelve solo los datos de la API

    const { data, error, isLoading } = useSWR('/api/pedidos', fetcher, {
        refreshInterval: 1000
    });

    const {handleClickCompletarPedido} = useQuiosco()

    if (isLoading) return "Cargando...";
    if (error) return <p>Error al cargar las órdenes: {error.message}</p>;

    console.log(data); // Verifica la estructura de los datos en la consola del navegador

    return (
        <div>
            <h1 className='text-4xl font-black'>Ordenes</h1>
            <p className='text-2xl my-10'>
                Administra las ordenes desde aquí
            </p>

            <div className="grid grid-cols-2 gap-5">
                {data?.data?.map(pedido => (
                    <div key={pedido.id} className="p-5 bg-white shadow space-y-2 border-b">
                        <p className='text-xl font-bold text-slate-600'>
                            Contenido del Pedido:
                        </p>

                        {pedido.productos && pedido.productos.length > 0 ? (
                            pedido.productos.map(producto => (
                                <div
                                    key={producto.id}
                                    className="border-b border-b-slate-200 last-of-type:border-none py-4"
                                >
                                    <p className="text-sm">ID: {producto.id}</p>
                                    <p className="text-sm"> {producto.nombre}</p>
                                    <p>
                                        Cantidad: {''}
                                        <span className="font-bold"> {producto.pivot.cantidad}</span>
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No hay productos en este pedido.</p>
                        )}
                        <p className='text-lg font-bold text-slate-600'>
                            Cliente: {''}
                            <span className="font-normal">{pedido.user.name}</span>
                        </p>

                        <p className='text-lg font-bold text-amber-600'>
                            Total a pagar: {''}
                            <span className="font-normal text-slate-600">{formatearDinero(pedido.total)}</span>
                        </p>

                        <div className="mt-5">
                            <button
                                type="button"
                                className="px-5 py-2 rounded uppercase font-bold text-white text-center w-full cursor-pointer bg-indigo-500 hover:bg-indigo-600 transition-colors"
                                onClick={() => handleClickCompletarPedido(pedido.id)}
                                >
                                Completar
                            </button>
                        </div>


                    </div>
                ))}
            </div>
        </div>
    );
}

export default Ordenes;
