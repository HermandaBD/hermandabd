import React, { useEffect, useMemo, useState } from "react";
import { getHermanos } from "../../api/hermano.api";
import { exportBD } from "../../api/bd.api";
import { useNavigate } from "react-router-dom";
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { Cargando } from "../../components/Cargando";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';

export function HermanosPage() {
    const [hermanos, setHermanos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInactive, setShowInactive] = useState(false); // Estado para mostrar/ocultar hermanos inactivos
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    async function exportar() {
        const response = await exportBD();
        return response;
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getHermanos();
                setHermanos(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Filtrar hermanos para mostrar solo los activos si showInactive es falso
    const filteredHermanos = useMemo(() => {
        return showInactive ? hermanos : hermanos.filter(h => !h.fecha_baja);
    }, [hermanos, showInactive]);

    const columns = useMemo(() => [
        {
            Header: 'Nº Hermano',
            accessor: 'numero_hermano'
        },
        {
            Header: 'Nombre',
            accessor: 'nombre'
        },
        {
            Header: 'Apellidos',
            accessor: 'apellidos'
        },
        {
            Header: 'DNI',
            accessor: 'dni'
        },
        {
            Header: 'Fecha Nacimiento',
            accessor: 'fecha_nacimiento'
        },
        {
            Header: 'Email',
            accessor: 'email'
        }
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
        state
    } = useTable(
        {
            columns,
            data: filteredHermanos,
        },
        useGlobalFilter,
        useSortBy
    );

    if (loading) return <Cargando />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='max-w-4xl mx-auto my-5'>
            <h1 className="text-2xl font-bold mb-5">Listado de Hermanos</h1>
            <div className="flex justify-between pr-5">
                <input
                    value={state.globalFilter || ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Buscar..."
                    className="mb-4 p-2 border border-black rounded"
                />
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer" />
            </div>

            <table {...getTableProps()} className="min-w-full bg-burdeos rounded-lg outline outline-black ">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className={`py-2 px-4 text-white  ${column.isSorted ? (column.isSortedDesc ? 'desc' : 'asc') : ''}`}
                                >
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, index) => {
                        prepareRow(row);
                        const rowClassName = index % 2 === 0 ? 'bg-white' : 'bg-sandy';
                        const { ...rowProps } = row.getRowProps();
                        return (
                            <tr key={row.original.id} {...rowProps} onClick={() => navigate(`/hermanos/${row.original.id}`)} className={`cursor-pointer ${rowClassName}`}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="py-2 px-4 border-b">{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="flex justify-between">

                <button className='bg-persian my-5 text-white' onClick={() => exportar()}>
                    <FontAwesomeIcon icon={faDownload} className="text-xl mr-1" />Exportar hermanos
                </button>
                <button className='bg-persian my-5 text-white' onClick={() => navigate('/import')}>
                    <FontAwesomeIcon icon={faUpload} className="text-xl mr-1" />Importar hermanos
                </button>
                <button
                    onClick={() => setShowInactive(!showInactive)}
                    className="my-5 p-2 bg-persian text-white rounded-lg"
                >
                    {showInactive ? 'Ocultar' : 'Mostrar'} Hermanos de Baja
                </button>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p>
                        Haz click en una cabecera para ordenar el listado por el campo seleccionado. <br />
                        La búsqueda se realiza en todos los campos, devuelve los resultados más similares.<br />
                        Para <strong>dar de baja</strong> a un hermano accede a su información y aplica una fecha de baja y guarda los cambios. <br />
                        Haciendo click en la fila entras a ver los detalles.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
