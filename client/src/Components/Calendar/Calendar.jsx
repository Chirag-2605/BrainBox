import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import './Calendar.css'
import axios from 'axios';

const Calendar = () => {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleDateSelect = async (selectInfo) => {
        let priority = prompt('Please enter the priority(high, medium, low)');
        let title = prompt('Please enter a title for the event (max 20 characters)');
        if(!title) return;
        if (title.length > 100) {
            alert('Title exceeds maximum allowed characters (20)');
            return;
        }
        try {
            const eventData = {
                title,
                start: selectInfo.start,
                end: selectInfo.end,
                priority,
            }

            const response = await axios.post('http://localhost:8080/api/events', eventData);
            if (response.status === 201) {
                console.log('Event saved successfully');
                await fetchEvents();
            } else {
                console.error('Failed to save event:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving event: ', error);
        }
    }

    const handleEventClick = async (clickInfo) => {
        if (
            window.confirm('Are you sure you want to delete this event?')
        ) try {
            const eventId = clickInfo.event.id;
            const response = await axios.delete(`http://localhost:8080/api/events/${eventId}`);
            if (response.status === 200) {
                    console.log('Event deleted successfully');
                    fetchEvents(); 
                } else {
                    console.error('Failed to delete event:', response.statusText);
                }
        } catch (error) {
            console.error('Error deleting event: ', error);
        }
    }

    const handleEventResize = async (resizeInfo) => {
        console.log(resizeInfo);
        const eventId = resizeInfo.event.id;
        const newStart = resizeInfo.start;
        const newEnd = resizeInfo.end;
        try {
            const response = await axios.put(`http://localhost:8080/api/events/${eventId}`, { start: newStart, end: newEnd });
            if (response.status === 200) {
                console.log('Event updated successfully');
                fetchEvents();
            } else {
                console.error('Failed to update event:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleEventDrop = async (dropInfo) => {
        const eventId = dropInfo.event.id;
        const updatedEvent = {
            id: eventId,
            start: dropInfo.event.start,
            end: dropInfo.event.end
        };

        try {
            const response = await axios.put(`http://localhost:8080/api/events/${eventId}`, updatedEvent);
            if (response.status === 200) {
                console.log('Event updated successfully');
                fetchEvents();
            } else {
                console.error('Failed to update event:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    return (

        <div className="calendar-container">
            <div className='backgroundEffect'></div>
            <div className='backgroundEffect-top'></div>
            <div className='backgroundEffect-bottom'></div>
            <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    headerToolbar={{

                        left: 'prev,next today',
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay"
                    }}
                    allDaySlot={false}
                    initialView="timeGridWeek"
                    slotDuration={"01:00:00"}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    nowIndicator={true}
                    events={events.map(event => ({
                        id: event._id, 
                        title: event.title,
                        start: event.start,
                        end: event.end,
                        color: event.color
                    }))}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    eventResize={handleEventResize}
                    eventDrop={handleEventDrop}
                />
        </div>
    )
}

export default Calendar