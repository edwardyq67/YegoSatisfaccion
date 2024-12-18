import { useEffect, useState } from 'react'
import LOGO from '../YEGO RECARGA/LOGO_YegoSatisfaccion.png'
import Cerrar_Secion from "../YEGO RECARGA/CERRAR SESIÓN.png"
import $ from 'jquery';
import { FaSearch } from "react-icons/fa";
import { FaRegFileExcel } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import '../App.css'
import axios from 'axios'
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import Spiner from '../snippet/Spiner';

function Satisfaccion() {
  const [datos, setDatos] = useState([])
  const [filtroEstrellas, setFiltroEstrellas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://api.yego.pro/Proceso/ratings");
        setDatos(res.data);
        setLoading(false);  // Oculta el spinner después de obtener datos
      } catch (error) {
        console.error('Error al obtener datos', error);
        setLoading(false);  // Asegura que el spinner desaparezca incluso si hay error
      }
    };

    fetchData();
  }, []);

  const datosFiltrados = datos.filter?.(dato => parseInt(dato.ratings) === filtroEstrellas);
  const navigate = useNavigate()
  const exportToExcel = () => {
    // Convierte los datos a un formato de hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();

    // Agrega la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Genera el archivo Excel
    XLSX.writeFile(workbook, "tabla_datos.xlsx");
  };
  useEffect(() => {
    // Configura el filtro
    $('#searchInput').on('keyup', function () {
      const value = $(this).val().toLowerCase();
      $('#registrosTable tbody tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });

    // Limpia el evento cuando se desmonta el componente
    return () => {
      $('#searchInput').off('keyup');
    };
  }, []);

  const renderStars = (ratings) => {
    return (
      <>
        {Array.from({ length: ratings }, (_, i) => (
          <FaStar key={i} className="text-yellow-500" />
        ))}
      </>
    );
  };
  const handleFiltroEstrellas = (num) => {
    setFiltroEstrellas(num);
  };
  const datosFinales = datosFiltrados?.length > 0 ? datosFiltrados : datos;
  const CerrarSecion = () => {
    localStorage.removeItem('token');

    // Redirecciona al login
    navigate('/');
  }
  return (
    <div className=' overflow-hidden'>
      {loading && <Spiner />}
      <header className='mb-5 header-center flex justify-between items-center'>
        <img src={LOGO} alt="" className='w-[25rem] h-auto py-[2rem] px-[0] pl-10' />
        <button className="profile-container" onClick={() => CerrarSecion()}>
          <a id="logoutButton" className='flex items-center mr-10 text-white gap-2'>Cerrar Sesión  <img src={Cerrar_Secion} alt="" className='w-[30px]' /></a>
        </button>
      </header>
      <main className='px-10 flex flex-col gap-5'>
        <form action="" className="flex items-center justify-center gap-1">
          <input
            id="searchInput" // Agregado ID para jQuery
            type="text"
            placeholder="Buscar..."
            className="w-full p-2 focus:outline-none shadow-md border rounded-md"
          />
          <div className="bg-slate-900 p-3 rounded-md text-white shadow-md cursor-pointer">
            <FaSearch />
          </div>
          <button onClick={() => exportToExcel()} className="flex gap-2 items-center justify-center p-2 text-white bg-green-500 rounded hover:bg-green-600">
            Exportar <FaRegFileExcel />
          </button>
        </form>
        <div className='flex gap-2 items-center'>
          <h3>Calificación: </h3>
          {Array.from({ length: 5 }, (_, i) => (
            <button key={i} onClick={() => handleFiltroEstrellas(i + 1)}>
              <FaStar className={`text-lg text-${i + 1 <= filtroEstrellas ? 'yellow-500' : 'gray-400'}`} />
            </button>
          ))}
        </div>
        <h3>Total de registros: <span>{datosFinales.length}</span></h3>
        <div className='overflow-x-scroll rounded-t-lg no-scrollbar'>
          <table id="registrosTable" className="table-auto min-w-[96vw]">
            <thead className='bg-[#d42929] text-white '>
              <tr>
                <th>ID</th>
                <th>Cuenta</th>
                <th>Motivo</th>
                <th>Agente</th>
                <th>Calificación</th>
                <th>Teléfono</th>
                <th>Recomendación</th>
                <th>Comentario</th>
                <th>Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {datosFinales?.map?.((dato, index) => (
                <tr key={dato.id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#F2F2F2]"} cursor-pointer`}>
                  <td>{dato.id + 1}</td>
                  <td>{dato.nameAccount}</td>
                  <td className="line-clamp-2 w-80">{dato.reason}</td>
                  <td>{dato.agent}</td>
                  <td className='flex'>{renderStars(dato.ratings)}</td>
                  <td>{dato.phone}</td>
                  <td>{dato.recommend}</td>
                  <td className="min-w-[400px] truncate-3-lines line-clamp-2 cursor-pointer">{dato.comment}</td>
                  <td className="whitespace-nowrap overflow-hidden truncate">
                    {new Date(dato.fechor).toLocaleString('es-PE', { timeZone: 'America/Lima' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>

  )
}

export default Satisfaccion

