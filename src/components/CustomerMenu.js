import React, { useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { useLocation } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';


export const CustomerMenu = (props) => {
    const { t, i18n } = useTranslation();
    let history = useHistory();

    const items = [
        {label: t('customer_infos'), to:'/customer-details-page/' , param: props.customerId},
        {label: t('reservations_and_services'), to:'/customer-reservation-page/', param: props.customerId},
        {label: t('reward_points'), to:'/customer-reward-points/' , param: props.customerId},
        {label: t('product_sales'), to:'/customer-product-sales/' , param: props.customerId},
        {label: t('package_sales'), to:'/customer-package-sales/' , param: props.customerId},
        {label: t('customer_debts'), to:'/customer-debts/' , param: props.customerId},
        {label: t('feedbacks'), to:'/customer-reviews/' , param: props.customerId},
        {label: t('customer_payments'), to:'/customer-payments/' , param: props.customerId},
        {label: t('customer_documents'), to:'/customer-files/' , param: props.customerId},
        {label: t('customer_photographs'), to:'/customer-photos/' , param: props.customerId}
    ];

    const changeTab = (e) => {
        //history.push({pathname:e.value.to + props.customerId})
        history.push({pathname: e.value.to + props.customerId, state: e});
    }

    return (
        <div className="grid">
            <div className="col-12"> 
                <TabMenu model={items} activeIndex={props.activeIndex} onTabChange={(e) => changeTab(e)} />
            </div>
       </div> 
                       
    );

}