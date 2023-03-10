import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import tr from 'date-fns/locale/tr'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button';
import { connect } from 'react-redux'
import { EmployeeService } from '../service/EmployeeService';
import { colors } from "../shared/colors";
import { useTranslation } from "react-i18next";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from 'primereact/dropdown';
import moment from "moment";
import { AppointmentService } from "../service/AppointmentService";
import  NewAppointmentDialogue  from "../pages/dialogues/NewAppointmentDialogue";
import {ReservationDetailDialogue} from "./dialogues/ReservationDetailDialogue";

import * as actions from '../store/actions';
import NewCheckDialogue from "./dialogues/NewCheckDialogue";

const locales = {
    'tr': tr,
    'en': enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const CalendarPage = (props) => {

    const { t, i18n } = useTranslation();
    const [reservationDialogue, setReservationDialogue] = useState(false);
    const [reservationTimeStart, setReservationTimeStart] = useState(null);
    const [reservationTimeEnd, setReservationTimeEnd] = useState(null);
    // const [events, setEvents] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [customer, setCustomer] = useState('');
    const [resourceId, setResourceId] = useState('');
    const [reservationDetailsDialog, setReservationDetailsDialog] = useState(false);
    const [reservationDetails, setReservationDetails] = useState(false);
    const [deleteOffHourDialog, setDeleteOffHourDialog] = useState(false);
    const [newCheckDialogue, setNewCheckDialogue] = useState(false);

    const viewOptions = [
        { label: t('day'), value: 'day' },
        { label: t('week'), value: 'week' },
        { label: t('month'), value: 'month' },
        { label: t('list'), value: 'agenda' }
    ]

    const employeeService = new EmployeeService();
    const appointmentService = new AppointmentService();

    useEffect(() => {
        employeeService.getEmployeeList(props.partnerId)
            .then((data) => {
                let allEmployees = [];

                data.forEach((employee, index) => {
                    employee.showInCalendar && allEmployees.push({
                        label: employee.name,
                        color: employee.colorForCalendar ? employee.colorForCalendar : index < colors.length ? colors[index] : 'var(--primary-color)',
                        ...employee
                    })
                });

                setAllEmployees(allEmployees);
                setSelectedEmployees(allEmployees);

                const today = new Date();

                const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                startDate.setHours(3);
                startDate.setMinutes(0);
                const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                endDate.setHours(26);
                endDate.setMinutes(59);
                appointmentService.getAppointmentServices(props.partnerId, startDate, endDate)
                    .then(data => {
                        let appointments = data.content;
                        for (let i = 0; i < appointments.length; i++) {
                            appointments[i].start = moment.utc(appointments[i].startTime).toDate();
                            appointments[i].end = moment.utc(appointments[i].endTime).toDate();
                            appointments[i].notes = appointments[i].title + "\n" +
                                t('notes') + ": " + appointments[i].notes;
                        }

                        appointmentService.getOffHours(props.partnerId)
                            .then(data => {
                                data.content.forEach(offHour => {
                                    if (offHour.status === 'deleted') return;
                                    appointments.push({
                                        ...offHour,
                                        title: t('off_hour'),
                                        start: moment.utc(offHour.startTime).toDate(),
                                        end: moment.utc(offHour.endTime).toDate(),
                                        resourceId: offHour.employeeId,
                                        isOffHour: true,
                                        notes: t('off_hour') + "\n" + t('notes') + ": " + offHour.notes
                                    })
                                });

                                props.changeAppointments(appointments);
                            });
                    });
                
                    // ToDo: Remove the following logic for demo events
                /*const today = new Date();

                allEmployees.forEach((employee, index) => {
                    const count = Math.floor(Math.random() * 3) + 1;
                    for (let i = 0; i < count; i++) {

                        const start = Math.floor(Math.random() * 9) + 9;
                        const duration = Math.floor(Math.random() * 4) + 1;

                        demoEvents.push({
                            title: demoServices[start % 5].label,
                            start: new Date(today.getMonth() + 1 + "." + today.getDate() + "." + today.getFullYear() + " " + start + ":00"),
                            end: new Date(today.getMonth() + 1 + "." + today.getDate() + "." + today.getFullYear() + " " + (start + duration) + ":00"),
                            allDay: false,
                            resourceId: employee.id
                        })
                    }
                })

                setEvents(demoEvents);*/
            });
    }, []);

    const customEventPropGetter = (event) => {
        if (event.isOffHour) {
            return {
                style: {
                    backgroundColor: 'var(--gray-800)'
                }
            };
        }

        const employee = allEmployees.find(employee => employee.id === event.resourceId);

        return employee.color ?
            {
                style: {
                    backgroundColor: employee.color
                }
            } : {};
    }

    const getDate = (date = new Date(), days) => {
        const previous = new Date(date.getTime());
        previous.setDate(date.getDate() + days);

        return previous;
    }

    const resourceHeaderWrapper = (resource) => {
        return <div style={{
            backgroundColor: resource.resource.color,
            color: 'white',
            height: 40,
            paddingTop: 10
        }}>{resource.label}</div>
    }

    const toolbarWrapper = (events) => {
        let difference = 1;
        let currentLabel = t('today');

        switch (events.view) {
            case 'week':
                difference = 7;
                currentLabel = t('this') + " " + t('week');
                break;
            case 'month':
            case 'agenda':
                difference = 30;
                currentLabel = t('this') + " " + t('month');
                break;
        }

        return (
            <div className="grid">
                <div className="col-4">
                    <Button icon="pi pi-chevron-left" style={{ marginBottom: '.3rem', marginTop: '-.5rem' }} onClick={() => {
                        const prev = getDate(events.date, difference * -1);
                        events.onNavigate(null, prev);
                    }} />
                    <Button label={currentLabel} style={{ marginBottom: '.3rem', marginLeft: '.3rem', marginRight: '.3rem', marginTop: '-.5rem', width: '100px', textAlign: 'center' }} onClick={() => {
                        events.onNavigate(null, new Date());
                    }} />
                    <Button icon="pi pi-chevron-right" style={{ marginBottom: '.3rem', marginTop: '-.5rem' }} onClick={() => {
                        const next = getDate(events.date, difference);
                        events.onNavigate(null, next);
                    }} />
                </div>
                <div className="col-6 justify-content-center flex">
                    <h4>{events.label}</h4>
                </div>
                <div className="col-2 justify-content-end flex">
                    <Dropdown value={events.view} options={viewOptions} dropdownIcon="pi pi-eye" style={{ marginBottom: '.3rem', marginTop: '-.5rem', width: '120px' }} onChange={(e) => {
                        events.onView(e.target.value);
                    }} />
                </div>
            </div>
        );
    }

    const components = useMemo(() => ({
        resourceHeader: resourceHeaderWrapper,
        toolbar: toolbarWrapper
    }), []);

    const deletePackageDialogFooter = (
        <React.Fragment>
            <Button label={t('no')} icon="pi pi-times" className="p-button-text" onClick={() => setDeleteOffHourDialog(false)} />
            <Button label={t('yes')} icon="pi pi-check" className="p-button-text" onClick={() => {
                appointmentService.deleteOffHour(reservationDetails.id)
                    .then(() => {
                        let newEvents = [...props.appointments];
                        newEvents = newEvents.filter(event => !event.isOffHour || event.id !== reservationDetails.id)

                        props.changeAppointments(newEvents);
                        setDeleteOffHourDialog(false);
                    })
            }} />
        </React.Fragment>
    );

    return (
        <div className="grid">
            <ReservationDetailDialogue visible={reservationDetailsDialog} onHide={setReservationDetailsDialog} reservationDetails={reservationDetails} history={props.history}/>
            <NewCheckDialogue visible={newCheckDialogue} onHide={setNewCheckDialogue} />
            <NewAppointmentDialogue 
                visible={reservationDialogue} 
                onHide={setReservationDialogue}
                start={reservationTimeStart} 
                end={reservationTimeEnd} 
                employeeId={resourceId} 
            />
            <Dialog visible={deleteOffHourDialog} style={{ width: '450px' }} header={t('confirm')} modal footer={deletePackageDialogFooter} onHide={() => {setDeleteOffHourDialog(false)}}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {<span>{t('confirm_delete_off_hour')}</span>}
                </div>
            </Dialog>
            <div className='col-6' >
                <MultiSelect filter showSelectAll={false} value={selectedEmployees}
                    options={allEmployees} onChange={(e) => {
                        setSelectedEmployees(e.target.value);
                    }} placeholder={t('employees')} />
            </div>
            <div className="col-6 flex justify-content-end flex-wrap card-container">
                <Button label={t('new_check')} icon="pi pi-plus" style={{ padding: '.45rem 1rem', marginBottom: "1rem", marginLeft: '1rem' }} className="p-button-success" onClick={() => setNewCheckDialogue(true)} />
            </div>
            <div className="col-12">
                <div className="card">
                    <Calendar
                        culture={i18n.language}
                        components={components}
                        events={props.appointments || []}
                        localizer={localizer}
                        showMultiDayTimes
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 1000 }}
                        defaultView={'day'}
                        min={new Date(2022, 0, 1, 9, 0, 0, 0)}
                        max={new Date(2022, 0, 1, 21, 0, 0, 0)}
                        dayLayoutAlgorithm={"no-overlap"}
                        selectable
                        onSelectEvent={(event) => {
                            if (event.isOffHour) {
                                setReservationDetails(event);
                                setDeleteOffHourDialog(true);
                            } else {
                                event.servicesString = event.serviceLabel;
                                event.customerFullname = event.customerName;
                                setReservationDetails(event);
                                setReservationDetailsDialog(true);
                            }
                        }}
                        onSelectSlot={(obj) => {
                            setResourceId(obj.resourceId);
                            setReservationTimeStart(obj.start);
                            setReservationTimeEnd(obj.end);
                            setReservationDialogue(true);
                        }}
                        resourceIdAccessor="id"
                        resourceTitleAccessor="label"
                        resources={selectedEmployees}
                        eventPropGetter={customEventPropGetter}
                        tooltipAccessor="notes"
                    />
                </div>
            </div>
        </div>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        changeAppointments: (appointments) => dispatch(actions.changeAppointments(appointments))
    };
};

const mapStateToProps = state => {
    return {
        partnerId: state.auth.userDetails.partner.id,
        partner: state.partner,
        appointments: state.appointments
    };
};

export default connect(mapStateToProps, mapDispatchToProps)((CalendarPage));