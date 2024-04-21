import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import './Calendar.css'
import Sidebar from '../Sidebar/Sidebar'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Calendar = () => {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const diffToast = (mssg) => {
        toast.success(mssg);
    }

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
        if (title.length > 20) {
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
                const newEvent = response.data;
                diffToast('Event created successfully');
                scheduleNotification(response.data);
                setEvents(prevEvents => [...prevEvents, newEvent]);
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
                    diffToast("Event Deleted Successfully");
                    // console.log('Event deleted successfully');
                    fetchEvents(); 
                } else {
                    console.error('Failed to delete event:', response.statusText);
                }
        } catch (error) {
            console.error('Error deleting event: ', error);
        }
    }

    const handleEventResize = async (resizeInfo) => {
        const eventId = resizeInfo.event.id;
        const endDelta = resizeInfo.endDelta;

        try {
            const response = await axios.get(`http://localhost:8080/api/events/${eventId}`);
            const eventData = response.data;
            const eventEnd = new Date(eventData.end);
            eventEnd.setMilliseconds(eventEnd.getMilliseconds() + endDelta.milliseconds);
            const updateResponse = await axios.put(`http://localhost:8080/api/events/${eventId}`, {end: eventEnd });
            if (updateResponse.status === 200) {
                diffToast('Event Updated successfully');
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
                diffToast('Event Updated successfully');
                fetchEvents();
            } else {
                console.error('Failed to update event:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const scheduleNotification = (event) => {
        const startTime = new Date(event.start);
        const currTime = new Date();
        const timeDiff = startTime.getTime() - currTime.getTime();
        if(timeDiff > 0) {
            setTimeout(()=>{
                if(Notification.permission === 'granted') {
                    new Notification('BrainBox : Event Reminder', {
                        body: `Event "${event.title}" is starting now`,
                        
                    });
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission=>{
                        if (permission === 'granted') {
                            new Notification('Event Reminder', {
                                body: `Event "${event.title}" is starting now!`,
                            });
                        }
                    })
                }
            }, timeDiff)
        }
    }

    return (
        <>
            <div className='calendar_component'>
                <Sidebar></Sidebar>
                <div className="calendar-container">
                    <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
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
                <ToastContainer position='top-center'/>
            </div>
        </>
    )
}

export default Calendar