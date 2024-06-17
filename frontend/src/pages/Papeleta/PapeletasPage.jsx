import React, { useEffect, useState } from "react";
import { getPapeletas } from "../../api/papeleta.api";
import { PapeletaList } from "../../components/papeleta/PapeletaList";
import { useNavigate } from "react-router-dom";
import { Cargando } from "../../components/Cargando";
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";

export function PapeletasPage() {
    const [papeletas, setPapeletas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getPapeletas();
                setPapeletas(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Nombre evento',
                accessor: 'nombre_evento'
            },
            {
                Header: 'Valor',
                accessor: 'valor'
            },
            {
                Header: 'Fecha',
                accessor: 'fecha'
            }
        ],
        []
    );

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
            data: papeletas,
        },
        useGlobalFilter,
        useSortBy
    );

    if (loading) return <Cargando />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='max-w-4xl mx-auto my-5'>
            <h1 className="text-2xl font-bold mb-5">Listado de Papeletas</h1>
            <div className="flex justify-between pr-5">
                <input
                    value={state.globalFilter || ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Buscar..."
                    className="mb-4 p-2 border border-black rounded"
                />
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer" />
            </div>
            <table {...getTableProps()} className="min-w-full -mx-4 bg-burdeos outline outline-black rounded-lg">
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
                            <tr key={row.original.id} {...rowProps} onClick={() => navigate(`/papeletas/${row.original.id}`)} className={`cursor-pointer ${rowClassName}`}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="py-2 px-4 border-b">{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
