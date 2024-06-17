import React, { useEffect, useState } from "react";
import { getEventos } from "../../api/evento.api";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from "@fullcalendar/core/locales/es";
import { Cargando } from "../../components/Cargando";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export function EventosPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        async function getEvents() {
            try {
                const response = await getEventos();
                setEvents(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getEvents();
    }, []);

    if (loading) return <Cargando />

    return (
        <div className="p-5 mx-56 ">
            <button
                className="bg-sandy text-white px-4 py-2 rounded-lg flex items-center mb-4 hover:bg-burdeos transition duration-300"
                onClick={() => navigate('/evento')}
            >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Nuevo evento
            </button>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                locale={esLocale}
                initialView="dayGridMonth"
                events={events}
                eventContent={renderEventContent}
                eventMouseEnter={(info) => {
                    const tooltip = document.createElement('div');
                    tooltip.innerHTML = `
                        <strong>Titulo:</strong> ${info.event.title}<br>
                        <strong>Inicio:</strong> ${info.event.start.toLocaleString()}<br>
                        <strong>Final:</strong> ${info.event.end ? info.event.end.toLocaleString() : ''}
                    `;
                    tooltip.style.position = 'absolute';
                    tooltip.style.backgroundColor = 'white';
                    tooltip.style.border = '1px solid black';
                    tooltip.style.padding = '10px';
                    tooltip.style.zIndex = '1000';
                    tooltip.style.pointerEvents = 'none';
                    tooltip.classList.add('fc-tooltip');

                    document.body.appendChild(tooltip);

                    info.el.addEventListener('mousemove', (e) => {
                        tooltip.style.left = `${e.pageX + 10}px`;
                        tooltip.style.top = `${e.pageY + 10}px`;
                    });
                }}
                eventMouseLeave={() => {
                    document.querySelectorAll('.fc-tooltip').forEach(el => el.remove());
                }}
            />
        </div>
    );
};

function renderEventContent(eventInfo) {
    return (
        <>
            {/* <b>{eventInfo.timeText}</b> */}
            <i>{eventInfo.event.title}</i>
        </>
    )
}


