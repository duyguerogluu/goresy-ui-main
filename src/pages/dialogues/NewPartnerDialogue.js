import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { Fieldset } from 'primereact/fieldset';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

import { WorkingHoursPicker } from '../../components/WorkingHoursPicker';
import { LunchBreakHoursPicker } from '../../components/LunchBreakHoursPicker';
import { PartnerService } from '../../service/PartnerService';
import { CityService } from '../../service/CityService';


export const NewPartnerDialogue = (props) => {
    const { t, i18n } = useTranslation();
    const toast = useRef(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [authorizedNameSurname, setAuthorizedNameSurname] = useState('');
    const [authorizedTelephone, setAuthorizedTelephone] = useState('');
    const [cityList, setCityList] = useState({});
    const [districtList, setDistrictList] = useState({});
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [selectedGender, setSelectedGender] = useState();
    const [selectedCountryCode, setSelectedCountryCode] = useState('+90');
    const [selectedSector, setSelectedSector] = useState();
    const [selectedCategory, setSelectedCategory] = useState();
    const [selectedSectorCategoryList, setSelectedSectorCategoryList] = useState();
    const [taxName, setTaxName] = useState('');
    const [taxNumber, setTaxNumber] = useState('');
    const [taxAdministration, setTaxAdministration] = useState('');
    const [taxAddress, setTaxAddress] = useState('');

    const [aboutText, setAboutText] = useState('');

    const [vatRate, setVatRate] = useState('');
    const [agentAccessPermission, setAgentAccessPermission] = useState(false);
    const [pastMonthData, setPastMonthData] = useState(false);

    const [workingHoursPanelCollapsed, setWorkingHoursPanelCollapsed] = useState(true);
    const [lunchBreakPanelCollapsed, setLunchBreakPanelCollapsed] = useState(true);
    const [workDayList, setWorkDayList] = useState([
        {
            "id": null,
            "dayNumber": 1,
            "open": true,
            "day": "monday",
            "dayShortName": "mon",
            "start": 540,
            "end": 1170,
            "breakStart": null,
            "breakEnd": null
        },
        {
            "id": null,
            "dayNumber": 2,
            "open": true,
            "day": "tuesday",
            "dayShortName": "tue",
            "start": 540,
            "end": 1170,
            "breakStart": null,
            "breakEnd": null
        },
        {
            "id": null,
            "dayNumber": 3,
            "open": true,
            "day": "wednesday",
            "dayShortName": "wed",
            "start": 540,
            "end": 1170,
            "breakStart": null,
            "breakEnd": null
        },
        {
            "id": null,
            "dayNumber": 4,
            "open": true,
            "day": "thursday",
            "dayShortName": "thu",
            "start": 540,
            "end": 1170,
            "breakStart": null,
            "breakEnd": null
        },
        {
            "id": null,
            "dayNumber": 5,
            "open": true,
            "day": "friday",
            "dayShortName": "fri",
            "start": 540,
            "end": 1170,
            "breakStart": null,
            "breakEnd": null
        },
        {
            "id": null,
            "dayNumber": 6,
            "open": true,
            "day": "saturday",
            "dayShortName": "sat",
            "start": 540,
            "end": 1170,
            "breakStart": null,
            "breakEnd": null
        },
        {
            "id": null,
            "dayNumber": 7,
            "open": true,
            "day": "sunday",
            "dayShortName": "sun",
            "start": 540,
            "end": 1170,
            "breakStart": null,
            "breakEnd": null
        }]);

    const countries = [
        { label: 'Australia (+123)', value: '+123' },
        { label: 'Brazil (+321)', value: '+321' },
        { label: 'China (+45)', value: '+45' },
        { label: 'Turkey (+90)', value: '+90' },
    ];

    const sectorList = [
        {
            label: 'personal_care', value: 'personal_care',
            categories: [
                { label: 'women_hairdresser', value: 'women_hairdresser' },
                { label: 'mens_hairdresser', value: 'mens_hairdresser' },
                { label: 'beauty_centre', value: 'beauty_centre' },
                { label: 'spa_wellnes', value: 'spa_wellnes' }
            ]
        },
        {
            label: 'automotive', value: 'automotive',
            categories: [
                { label: 'vehicle_service', value: 'vehicle_service' },
                { label: 'car_washing', value: 'car_washing' },
                { label: 'rent_a_car', value: 'rent_a_car' },
                { label: 'auto_expert', value: 'auto_expert' },
                { label: 'tire', value: 'tire' }
            ]
        },
        {
            label: 'food', value: 'food',
            categories: [
                { label: 'restaurant', value: 'restaurant' },
                { label: 'bistro', value: 'bistro' }
            ]
        },
        {
            label: 'health', value: 'health',
            categories: [
                { label: 'medical_analysis_center', value: 'medical_analysis_center' },
                { label: 'gynecology', value: 'gynecology' },
                { label: 'teeth', value: 'teeth' },
                { label: 'veterinary', value: 'veterinary' }
            ]
        },
        {
            label: 'fashion', value: 'fashion',
            categories: [
                { label: 'special_sew', value: 'special_sew' },
                { label: 'fashion_house', value: 'fashion_house' }
            ]
        },
        {
            label: 'sport_entertainment', value: 'sport_entertainment',
            categories: [
                { label: 'gym', value: 'gym' },
                { label: 'yoga_plates_hall', value: 'yoga_plates_hall' },
                { label: 'fortune_teller', value: 'fortune_teller' },
            ]
        },
        {
            label: 'education_other', value: 'education_other',
            categories: [
                { label: 'private_steering_lesson', value: 'private_steering_lesson' },
                { label: 'private_dance_lesson', value: 'private_dance_lesson' },
                { label: 'private_music_lesson', value: 'private_music_lesson' },
                { label: 'other_special_lessons', value: 'other_special_lessons' }
            ]
        },
        {
            label: 'cleaning', value: 'cleaning',
            categories: [
                { label: 'carpet_washing', value: 'carpet_washing' },
                { label: 'home_office_cleaning', value: 'home_office_cleaning' }
            ]
        },
        {
            label: 'law_property', value: 'law_property',
            categories: [
                { label: 'law_office', value: 'law_office' },
                { label: 'lawyer', value: 'lawyer' },
                { label: 'real_estate', value: 'real_estate' }
            ]
        },
    ];

    const genders = [
        { label: t('women'), value: 'women' },
        { label: t('men'), value: 'men' },
        { label: t('women_and_men'), value: 'women_and_men' }
    ];

    const partnerService = new PartnerService();
    const cityService = new CityService();

    useEffect(() => {
        cityService.getCityList().then(data => {setCityList(data)});
    }, []);

    const onGenderChange = (e) => {
        setSelectedGender(e.target.value);
    }

    const onCityChange = (e) =>{
        setCity(e.target.value);
        cityService.getDistrictListByCityId(e.target.value).then(data => {setDistrictList(data)});
    }

    const onDistrictChange = (e) => {
        setDistrict(e.target.value);
    }

    const onSelectedSectorChange = (e) => {
        setSelectedSector(e.target.value);
        if (e.target.value != null) {
            const sector = sectorList.find(sector => sector.value === e.target.value);
            setSelectedSectorCategoryList(sector.categories);
        } else {
            setSelectedCategory(null);
        }
    }

    const onCountryCodeChange = (e) => {
        setSelectedCountryCode(e.value);
    }

    const listItems = workDayList.map((workDay) =>
        <div className='col-12' key={workDay.dayNumber}>
            <WorkingHoursPicker day={t(workDay.dayNumber)} dayName={t(workDay.dayShortName)} startHour={workDay.start} endHour={workDay.end} open={workDay.open}
                handleAvailabilityChange={(e, dayNumber) => onAvailabilityChange(e, dayNumber)} handleStartingHourChange={(e, dayNumber) => onStartingHourChange(e, dayNumber)}
                handleEndingHourChange={(e, dayNumber) => onEndingHourChange(e, dayNumber)} />
        </div>
    );

    const listItemsBreakHour = workDayList.map((workDay) =>
        <div className='col-12' key={workDay.dayNumber}>
            <LunchBreakHoursPicker day={t(workDay.dayNumber)} dayName={t(workDay.day)}  startHour={workDay.breakStart} endHour={workDay.breakEnd}
                handleBreakStartingHourChange={(e, dayNumber) => onBreakStartingHourChange(e, dayNumber)}
                handleBreakEndingHourChange={(e, dayNumber) => onBreakEndingHourChange(e, dayNumber)} />
        </div>
    );
    const onAvailabilityChange = (e, dayNumber) => {
        workDayList.find(x => x.dayNumber == dayNumber).working = e.target.value;
    }

    const onStartingHourChange = (e, dayNumber) => {
        workDayList.find(x => x.dayNumber == dayNumber).start = e.target.value;
    }

    const onEndingHourChange = (e, dayNumber) => {
        workDayList.find(x => x.dayNumber == dayNumber).end = e.target.value;
    }

    const onBreakStartingHourChange = (e, dayNumber) => {
        workDayList.find(x => x.dayNumber == dayNumber).breakStart = e.target.value;
    }

    const onBreakEndingHourChange = (e, dayNumber) => {
        workDayList.find(x => x.dayNumber == dayNumber).breakEnd = e.target.value;
    }

    const onAvailabilityChang = (day, value) => {
        console.log(day);
        console.log(value);
    }

    const addNewPartner = () => {
        let partner = {
            aboutText: aboutText,
            address: address,
            agentAccessPermission: false,
            authorizedNameSurname: authorizedNameSurname,
            authorizedTelephone: authorizedTelephone,
            available: true,
            cash: true,
            category: selectedCategory,
            cityId: city,
            creditCard: true,
            creditCardOnline: true,
            customerGender: selectedGender,
            districtId: district,
            email: email,
            featured: true,
            monthlyPrice: 0,
            name: name,
            pastMonthData: true,
            sector: selectedSector,
            taxAddress: taxAddress,
            taxAdministration: taxAdministration,
            taxName: taxName,
            taxNumber: taxNumber,
            telephone: selectedCountryCode + phone,
            timezone: "Europe/Istanbul",
            vatRate: 0,
            voteCount: 0,
            workDays: workDayList
        };
        partnerService.createPartner(partner).then(() =>
            toast.current.show({
                severity: 'success',
                summary: t('save_successed'),
                detail: t('save_completed_successfully'),
                life: 3000
            }),
            hideDialog(),
        )
        console.log('partner');

    }

    const hideDialog = () => {
        props.onHide(false);
    }

    return (
        <Dialog visible={props.visible} style={{ width: '75vw' }} header={t('add_new_partner')} modal
            className="p-fluid" onHide={props.onHide} resizable={false} draggable={false} dismissableMask={true} >
            <Toast ref={toast} />
            <div className="grid">
                <div className='col-6'>
                    <InputText value={name} onChange={(e)=>{setName(e.target.value)}} className='inputfield w-full' required autoFocus placeholder={t('partner_name')} />
                </div>
                <div className='col-6'>
                    <InputText value={email}  onChange={(e)=>{setEmail(e.target.value)}}  className='inputfield w-full' required placeholder={t('email')} />
                </div>
                <div className='col-6'>
                    <InputText value={authorizedNameSurname}  onChange={(e)=>{setAuthorizedNameSurname(e.target.value)}}  className='inputfield w-full' required placeholder={t('authorized_name_surname')} />
                </div>
                <div className='col-6'>
                    <InputText value={authorizedTelephone} onChange={(e)=>{setAuthorizedTelephone(e.target.value)}} className='inputfield w-full' required placeholder={t('authorized_telephone')} />
                </div>
                <div className='col-12'>
                    <InputText value={address}  onChange={(e)=>{setAddress(e.target.value)}}  className='inputfield w-full' required placeholder={t('address')} />
                </div>
                <div className='col-4'>
                    <Dropdown value={city} options={cityList} optionLabel="cityName" optionValue="id" onChange={onCityChange} filter showClear filterBy="cityName"  className='inputfield w-full' required placeholder={t('city')} />
                </div>
                <div className='col-4'>
                    <Dropdown value={district} options={districtList} optionLabel="districtName" optionValue="id" onChange={onDistrictChange}  filter showClear filterBy="districtName" className='inputfield w-full' required placeholder={t('district')} />
                </div>
                <div className='col-4'>
                    <Dropdown className='inputfield w-full' value={selectedGender} options={genders} onChange={onGenderChange} optionLabel="label" filter showClear filterBy="label" placeholder={t('customer_gender')} />
                </div>
                <div className='col-4 '>
                    <Dropdown className='inputfield w-full' value={selectedCountryCode} options={countries} onChange={onCountryCodeChange} optionLabel="label" filter showClear filterBy="label" placeholder="Select a Country" />
                </div>
                <div className='col-8'>
                    <InputText className='inputfield w-full' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('phone_number')} />
                </div>
                <div className='col-4'>
                    <Dropdown className='inputfield w-full' value={selectedSector} options={sectorList} onChange={onSelectedSectorChange} optionLabel="label" filter showClear filterBy="label" placeholder="Select a sector" />
                </div>
                <div className='col-8'>
                    <Dropdown className='inputfield w-full' options={selectedSectorCategoryList} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} placeholder="Select a category" />
                </div>
                <div className='col-4'>
                    <InputText value={taxName}  onChange={(e)=>{setTaxName(e.target.value)}} className='inputfield w-full' required placeholder={t('tax_name')} />
                </div>
                <div className='col-4'>
                    <InputText value={taxNumber}  onChange={(e)=>{setTaxNumber(e.target.value)}} className='inputfield w-full' required placeholder={t('tax_number')} />
                </div>
                <div className='col-4'>
                    <InputText value={taxAdministration}  onChange={(e)=>{setTaxAdministration(e.target.value)}} className='inputfield w-full' required placeholder={t('tax_administration')} />
                </div>
                <div className='col-12'>
                    <InputText value={taxAddress}  onChange={(e)=>{setTaxAddress(e.target.value)}} className='inputfield w-full' required placeholder={t('tax_address')} />
                </div>

                <div className='col-12'>
                    <InputText value={aboutText}  onChange={(e)=>{setAboutText(e.target.value)}}  className='inputfield w-full' required placeholder={t('about_text')} />
                </div>

                <div className="col-12">
                    <Fieldset legend={t('working_hours')} toggleable collapsed={workingHoursPanelCollapsed} onToggle={(e) => setWorkingHoursPanelCollapsed(e.value)}>
                        <div className="grid">
                            {listItems}
                        </div>
                    </Fieldset>
                </div>
                <div className="col-12">
                    <Fieldset legend={t('lunch_break_hours')} toggleable collapsed={lunchBreakPanelCollapsed} onToggle={(e) => setLunchBreakPanelCollapsed(e.value)}>
                        <div className="grid">
                            {listItemsBreakHour}
                        </div>
                    </Fieldset>
                </div>

                <div className='col-12'>
                    <Button label={t('save')} className="p-button-success" onClick={addNewPartner} />
                </div>
            </div>
        </Dialog>
    );
}

export default NewPartnerDialogue;