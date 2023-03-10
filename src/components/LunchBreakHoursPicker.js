import React, { useState } from 'react';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';

export const LunchBreakHoursPicker = ({dayName, day, startHour, endHour, handleBreakStartingHourChange, handleBreakEndingHourChange}) => {

    const { t } = useTranslation();
    const [breakStartHour, setBreakStartHour] = useState(startHour);
    const [breakEndHour, setBreakEndHour] = useState(endHour);
    const hourOptions = [
        { label: t('none'), value: null },
        { label: '09:00', value: 540 },
        { label: '09:30', value: 570 },
        { label: '10:00', value: 600 },
        { label: '10:30', value: 630 },
        { label: '11:00', value: 660 },
        { label: '11:30', value: 690 },
        { label: '12:00', value: 720 },
        { label: '12:30', value: 750 },
        { label: '13:00', value: 780 },
        { label: '13:30', value: 810 },
        { label: '14:00', value: 840 },
        { label: '14:30', value: 870 },
        { label: '15:00', value: 900 }
    ];


    const onBreakStartingHourChange = (e) => {
        handleBreakStartingHourChange(e, day);
        setBreakStartHour(e.value);
    }

    const onBreakEndingHourChange = (e) => {
        handleBreakEndingHourChange(e, day);
        setBreakEndHour(e.value);
    }

    return (
        <div className="grid">
            <div className='col-2'>
                <p style={{ marginTop: '.5rem' }}>
                    {dayName}
                </p>
            </div>
            <div className='col-5'>
                <Dropdown value={breakStartHour} options={hourOptions} onChange={onBreakStartingHourChange}  className='inputfield w-full' />
            </div>
            <div className='col-5'>
                <Dropdown value={breakEndHour} options={hourOptions} onChange={onBreakEndingHourChange} className='inputfield w-full' />
            </div>
            <Divider />
        </div>
    );
}

export default LunchBreakHoursPicker;