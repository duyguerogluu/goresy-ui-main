import React, { useState } from 'react';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';

export const WorkingHoursPicker = ({dayName, startHour, endHour, open, day,
    handleAvailabilityChange, handleStartingHourChange, handleEndingHourChange}) => {

    const { t } = useTranslation();
    const [startingHour, setStartingHour] = useState(startHour);
    const [endingHour, setEndingHour] = useState(endHour);
    const [hourOptions, setHourOptions] = useState([
        { label: '05:00', value: 300 },
        { label: '05:30', value: 330 },
        { label: '06:00', value: 360 },
        { label: '06:30', value: 390 },
        { label: '07:00', value: 420 },
        { label: '07:30', value: 450 },
        { label: '08:00', value: 480 },
        { label: '08:30', value: 510 },
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
        { label: '15:00', value: 900 },
        { label: '15:30', value: 930 },
        { label: '16:00', value: 960 },
        { label: '16:30', value: 990 },
        { label: '17:00', value: 1020 },
        { label: '17:30', value: 1050 },
        { label: '18:00', value: 1080 },
        { label: '18:30', value: 1110 },
        { label: '19:00', value: 1140 },
        { label: '19:30', value: 1170 },
        { label: '20:00', value: 1200 },
        { label: '20:30', value: 1230 },
        { label: '21:00', value: 1260 },
        { label: '21:30', value: 1290 },
        { label: '22:00', value: 1320 },
        { label: '22:30', value: 1350 },
        { label: '23:00', value: 1380 },
        { label: '23:30', value: 1410 },
    ]);

    const [availability, setAvailability] = useState(open);

    const availabilityOptions = [
        { label: t('open'), value: true },
        { label: t('closed'), value: false }
    ];

    const onAvailabilityChange = (e) => {
        handleAvailabilityChange(e, day);
        setAvailability(e.value);
    }

    const onStartingHourChange = (e) => {
        handleStartingHourChange(e, day);
        setStartingHour(e.value);
    }

    const onEndingHourChange = (e) => {
        handleEndingHourChange(e, day);
        setEndingHour(e.value);
    }

    return (
        <div className="grid">
            <div className='col-1'>
                <p style={{ marginTop: '.5rem' }}>
                    {dayName}
                </p>
            </div>
            <div className='col-3'>
                <Dropdown value={availability} options={availabilityOptions} onChange={onAvailabilityChange} className='inputfield w-full' />
            </div>
            {availability ?
                <div className='col-8'>
                    <div className='grid'>
                        <div className='col-6'>
                            <Dropdown value={startingHour} options={hourOptions} onChange={onStartingHourChange} className='inputfield w-full' />
                        </div>
                        <div className='col-6'>
                            <Dropdown value={endingHour} options={hourOptions} onChange={onEndingHourChange} className='inputfield w-full' />
                        </div>
                    </div>
                </div>
                : <div></div>
            }
            <Divider />
        </div>
    );
}

export default WorkingHoursPicker