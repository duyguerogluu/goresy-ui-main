import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import {Dropdown} from "primereact/dropdown";
import { Toast } from 'primereact/toast';

import { PromotionService } from '../service/PromotionService';
import {connect} from "react-redux";

const PromotionsPage = (props) => {
    const { t } = useTranslation();
    const toast = useRef(null);
    const [promotionId, setPromotionId] = useState(null);
    const [paymentsWithCash, setPaymentsWithCash] = useState(0);
    const [paymentsWithCard, setPaymentsWithCard] = useState(0);
    const [pointsUsageLowerLimit, setPointsUsageLowerLimit] = useState(0);
    const [birthdaySpecialDiscount, setBirthdaySpecialDiscount] = useState(0);
    const [onlineBookingDiscount, setOnlineBookingDiscount] = useState(0);

    const paymentsWithCashOption = [
        { label: "0%", value: 0},
        { label: "1%", value: 1},
        { label: "2%", value: 2},
        { label: "3%", value: 3},
        { label: "4%", value: 4},
        { label: "5%", value: 5},
        { label: "6%", value: 6},
        { label: "7%", value: 7},
        { label: "8%", value: 8},
        { label: "9%", value: 9},
        { label: "10%", value: 10},
        { label: "15%", value: 15},
        { label: "20%", value: 20},
        { label: "25%", value: 25},
        { label: "30%", value: 30},
        { label: "35%", value: 35},
        { label: "40%", value: 40},
        { label: "45%", value: 45},
        { label: "50%", value: 50},
    ];

    const pointsUsageLowerLimitOption = [
        { label: "0 TL", value: 0},
        { label: "10 TL ", value: 10},
        { label: "20 TL ", value: 20},
        { label: "30 TL ", value: 30},
        { label: "40 TL ", value: 40},
        { label: "50 TL ", value: 50},
        { label: "100 TL ", value: 100},
        { label: "200 TL ", value: 200},
        { label: "300 TL ", value: 300},
        { label: "400 TL ", value: 400},
        { label: "500 TL ", value: 500},
        { label: "600 TL ", value: 600},
        { label: "700 TL ", value: 700},
        { label: "800 TL ", value: 800},
        { label: "900 TL ", value: 900},
        { label: "1000 TL ", value: 1000},
    ]

    const promotionService = new PromotionService();

    useEffect(() => {
        promotionService.getPromotionsOfPartner(props.partnerId).then(data => {
            setPromotionId(data.id);
            setPaymentsWithCash(data.paymentsWithCash);
            setPaymentsWithCard(data.paymentsWithCard);
            setPointsUsageLowerLimit(data.pointsUsageLowerLimit);
            setBirthdaySpecialDiscount(data.birthdaySpecialDiscount);
            setOnlineBookingDiscount(data.onlineBookingDiscount);
         });
    }, [t]);

    const updatePromotions = () => {
      let newPromotion = {
        partnerId: props.partnerId,
        paymentsWithCash: paymentsWithCash,
        paymentsWithCard: paymentsWithCard,
        birthdaySpecialDiscount: birthdaySpecialDiscount,
        onlineBookingDiscount: onlineBookingDiscount,
        pointsUsageLowerLimit: pointsUsageLowerLimit,
      };
      if (promotionId == null) {
        promotionService.addPromotions(newPromotion).then((data) => {
          setPromotionId(data.id);
          setPaymentsWithCash(data.paymentsWithCash);
          setPaymentsWithCard(data.paymentsWithCard);
          setPointsUsageLowerLimit(data.pointsUsageLowerLimit);
          setBirthdaySpecialDiscount(data.birthdaySpecialDiscount);
          setOnlineBookingDiscount(data.onlineBookingDiscount);
          toast.current.show({
            severity:'success', 
            summary: t('save_successed'),
            detail: t('save_completed_successfully'), 
            life: 3000
        })
        });
      } else {
        promotionService.updatePromotions(promotionId, newPromotion).then((data) => {
            setPromotionId(data.id);
            setPaymentsWithCash(data.paymentsWithCash);
            setPaymentsWithCard(data.paymentsWithCard);
            setPointsUsageLowerLimit(data.pointsUsageLowerLimit);
            setBirthdaySpecialDiscount(data.birthdaySpecialDiscount);
            setOnlineBookingDiscount(data.onlineBookingDiscount);
            toast.current.show({
                severity:'success', 
                summary: t('save_successed'),
                detail: t('save_completed_successfully'), 
                life: 3000
            })
          });
      }
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="grid p-fluid">
                <div className='col-12'>
                    <div className="flex justify-content-start flex-wrap card-container col">
                        <h2><b>{t('promotions')}</b></h2>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='grid p-fluid'>
                        <div className='col-9' style={{alignSelf: 'center'}}>
                            <label htmlFor="appointmentResolution">{t('earned_from_payments_with_cash')}</label>
                        </div>
                        <div className='col-3'>
                            <Dropdown id="appointmentResolution" value={paymentsWithCash} options={paymentsWithCashOption} optionLabel='label' optionValue='value'
                                      onChange={e => setPaymentsWithCash(e.target.value)} className='inputfield w-full'
                            />
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='grid p-fluid'>
                        <div className='col-9' style={{alignSelf: 'center'}}>
                            <label htmlFor="hourFormat">{t('earned_from_payments_with_card')}</label>
                        </div>
                        <div className='col-3'>
                            <Dropdown id="hourFormat" value={paymentsWithCard} options={paymentsWithCashOption} optionLabel='label' optionValue='value'
                                      onChange={e => setPaymentsWithCard(e.target.value)} className='inputfield w-full'
                            />
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='grid p-fluid'>
                        <div className='col-9' style={{alignSelf: 'center'}}>
                            <label htmlFor="google_calender_link">{t('points_usage_lower_limit')}</label>
                        </div>
                        <div className='col-3'>
                            <Dropdown id="hourFormat" value={pointsUsageLowerLimit} options={pointsUsageLowerLimitOption} optionLabel='label' optionValue='value'
                                      onChange={e => setPointsUsageLowerLimit(e.target.value)} className='inputfield w-full'
                            />
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='grid p-fluid'>
                        <div className='col-9' style={{alignSelf: 'center'}}>
                            <label htmlFor="hourFormat">{t('birthday_special_discount')}</label>
                        </div>
                        <div className='col-3'>
                            <Dropdown id="hourFormat" value={birthdaySpecialDiscount} options={paymentsWithCashOption} optionLabel='label' optionValue='value'
                                      onChange={e => setBirthdaySpecialDiscount(e.target.value)} className='inputfield w-full'
                            />
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='grid p-fluid'>
                        <div className='col-9' style={{alignSelf: 'center'}}>
                            <label htmlFor="hourFormat">{t('online_booking_discount')}</label>
                        </div>
                        <div className='col-3'>
                            <Dropdown id="hourFormat" value={onlineBookingDiscount} options={paymentsWithCashOption} optionLabel='label' optionValue='value'
                                      onChange={e => setOnlineBookingDiscount(e.target.value)} className='inputfield w-full'
                            />
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <Button label={t('save')} className="p-button-success" onClick={updatePromotions}/>
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

export default connect(mapStateToProps, null)((PromotionsPage));