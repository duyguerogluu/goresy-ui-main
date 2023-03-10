import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { WorkingHoursPicker } from '../components/WorkingHoursPicker';
import { Fieldset } from 'primereact/fieldset';
import { LunchBreakHoursPicker } from '../components/LunchBreakHoursPicker';
import { WorkingHoursService } from '../service/WorkingHoursService';
import {Toast} from "primereact/toast";
import {connect} from "react-redux";

const WorkingHoursPage = (props) => {

    const { t } = useTranslation();
    const toast = useRef(null);
    const [lunchBreakPanelCollapsed, setLunchBreakPanelCollapsed] = useState(false);
    const [partnerInfo, setPartnerInfo] = useState(null);
    const [workDayList, setWorkDayList] = useState([]);
    
    const workingHoursService = new WorkingHoursService();

    useEffect(() => {
        workingHoursService.getWorkingHours(props.partnerId).then(data => {setPartnerInfo(data);setWorkDayList(data.workDays)});
    }, []);

    const listItems = workDayList.map((workDay) =>
        <div className='col-12' key={workDay.dayNumber}>
            <WorkingHoursPicker day={t(workDay.dayNumber)} dayName={t(workDay.dayShortName)} startHour={workDay.start} endHour={workDay.end} open={workDay.working} 
            handleAvailabilityChange={(e, dayNumber) => onAvailabilityChange(e, dayNumber)} handleStartingHourChange={(e, dayNumber) => onStartingHourChange(e, dayNumber)} 
            handleEndingHourChange={(e, dayNumber) => onEndingHourChange(e, dayNumber)}/>
        </div>
    );

    const listItemsBreakHour = workDayList.map((workDay) =>
        <div className='col-12' key={workDay.dayNumber}>
            <LunchBreakHoursPicker day={t(workDay.dayNumber)}  dayName={t(workDay.day)}  startHour={workDay.breakStart} endHour={workDay.breakEnd} 
            handleBreakStartingHourChange={(e, dayNumber) => onBreakStartingHourChange(e, dayNumber)} 
            handleBreakEndingHourChange={(e, dayNumber) => onBreakEndingHourChange(e, dayNumber)}/>
        </div>
    );

    const onAvailabilityChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber == dayNumber).working = e.target.value;
    }
    
    const onStartingHourChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber == dayNumber).start = e.target.value;
    }

    const onEndingHourChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber == dayNumber).end = e.target.value;
    }

    const onBreakStartingHourChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber == dayNumber).breakStart = e.target.value;
    }

    const onBreakEndingHourChange = (e, dayNumber) => {
        workDayList.find(x=>x.dayNumber == dayNumber).breakEnd = e.target.value;
    }

    const updateWorkingHours=()=>{
        let workdayDto = {
            partnerId: partnerInfo.id,
            workDayDtoList: workDayList,
        }
        workingHoursService.updatePartnerWorkday(partnerInfo.id, workdayDto).then(
            toast.current.show({
                severity: 'success',
                summary: t('save_successed'),
                detail: t('save_completed_successfully')
            }),
        ).catch(() => {
            toast.current.show({
                severity: 'error',
                summary: t('save_fail'),
                detail: t('save_fail')
            });
        });
    }

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="grid">
                <div className='col-12'>
                    <h3>
                        {t('working_hours')}
                    </h3>
                </div>
                {listItems}
                <Fieldset legend={t('lunch_break_hours')} toggleable collapsed={lunchBreakPanelCollapsed} onToggle={(e) => setLunchBreakPanelCollapsed(e.value)}>
                    <div className="grid">
                        {listItemsBreakHour}
                    </div>
                </Fieldset>
                <div className='col-12'>
                    <Button className='inputfield w-full' label={t('save')} onClick={updateWorkingHours} />
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        partnerId: state.auth.userDetails.partner.id
    };
};

export default connect(mapStateToProps, null)((WorkingHoursPage));