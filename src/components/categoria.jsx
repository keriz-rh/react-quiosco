import useQuiosco from "../hooks/useQuiosco";

function Categoria({ categoria }) {
    const { handleClickCategoria, categoriaActual } = useQuiosco();
    const { icono, id, nombre } = categoria;

    const resaltarcategoriaActual = () => 
        categoriaActual.id === id ? "bg-amber-400" : "bg-white";

    return (
        <div 
            className={`${resaltarcategoriaActual()} flex items-center gap-4 border w-full p-3 hover:bg-amber-400 cursor-pointer`}
        >
            <img 
                alt="imagen icono" 
                src={`/img/icono_${icono}.svg`} 
                className="w-12"
            />
            <button 
                className="text-lg font-bold cursor-pointer truncate"
                type="button"
                onClick={() => handleClickCategoria(id)}
            >
                {nombre}
            </button>
        </div>
    );
}

export default Categoria;
