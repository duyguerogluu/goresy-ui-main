import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';

export const MembershipPage = () => {

    const toast = useRef(null);
    const { t, i18n } = useTranslation();

    const [selectedStarter, setSelectedStarter] = useState(null);
    const [selectedStarterIndefinite, setSelectedStarterIndefinite] = useState(null);
    const [selectedStandart, setSelectedStandart] = useState(null);
    const [selectedFull, setSelectedFull] = useState(null);
  
    const starter = [
        { name: 'Randevu yönetimi', code: 'NY' },
        { name: 'Müşteri takibi', code: 'RM' },
        { name: 'Online randevu sistemi', code: 'LDN' },
        { name: 'Aylık 100 Randevu Sınırı', code: 'IST' }
    ];

    const starterIndefinite = [
        { name: 'Randevu yönetimi', code: 'NY' },
        { name: 'Müşteri takibi', code: 'RM' },
        { name: 'Online randevu sistemi', code: 'LDN' },
        { name: 'Sınırsız Randevu', code: 'IST' }
    ];

    const standart = [
        { name: '6 personele kadar', code: 'NY' },
        { name: 'Randevu yönetimi', code: 'RM' },
        { name: 'Müşteri takibi', code: 'LDN' },
        { name: 'Online randevu sistemi', code: 'IST' },
        { name: 'Özel Müşteri Temsilcisi', code: 'IST' },
        { name: 'Sınırsız Randevu', code: 'IST' },
        { name: 'Randevu hatırlatma SMSleri dahil', code: 'IST' },
        { name: 'Adisyon yönetimi', code: 'IST' },
        { name: 'Gelir takibi', code: 'IST' },
        { name: 'Masraf takibi', code: 'IST' },
        { name: 'Müşteri parapuan sistemi', code: 'IST' },
        { name: 'Müşteri memnuniyet SMSleri', code: 'IST' },
        { name: 'Gelişmiş personel yetki yönetimi', code: 'IST' }
    ];

    const full = [
        { name: 'Randevu yönetimi', code: 'RM' },
        { name: 'Müşteri takibi', code: 'LDN' },
        { name: 'Online randevu sistemi', code: 'IST' },
        { name: 'Özel Müşteri Temsilcisi', code: 'IST' },
        { name: 'Sınırsız Randevu', code: 'IST' },
        { name: 'Randevu hatırlatma SMSleri dahil', code: 'IST' },
        { name: 'Adisyon yönetimi', code: 'IST' },
        { name: 'Gelir takibi', code: 'IST' },
        { name: 'Masraf takibi', code: 'IST' },
        { name: 'Müşteri parapuan sistemi', code: 'IST' },
        { name: 'Müşteri memnuniyet SMSleri', code: 'IST' },
        { name: 'Gelişmiş personel yetki yönetimi', code: 'IST' },
        { name: 'Ürün satışı ve stok takibi', code: 'NY' },
        { name: 'Paket satışı takibi', code: 'NY' },
        { name: 'Cari alacak takibi', code: 'NY' },
        { name: 'Personel prim takibi', code: 'NY' },
        { name: 'Kendi ismiyle Web Sitesi', code: 'NY' },
        { name: 'Google Takvim entegrasyonu', code: 'NY' }
    ];


    return (
        <div>
            <div className="grid p-fluid">
                <div className="grid col-12">
                    <div className='col-8'>
                        <label style={{ fontWeight:'bold', fontSize: '16pt'}} htmlFor="name">{t('monthly_subscription_plans')}</label>    
                    </div>
                    <div className="col-4">
                        <label htmlFor="amount"></label>    
                    </div>
                </div>
                <div className="grid col-12">
                    <div className='col-3'>
                        <h5>{t('starter')}</h5>
                        <ListBox value={selectedStarter} options={starter} onChange={(e) => setSelectedStarter(e.value)} optionLabel="name"/>
                        <Button label={t('drop_package')} className="p-button-info" style={{ marginTop: "1rem" }}/>
                    </div>

                    <div className='col-3'>
                        <h5>{t('starter_in')}</h5>
                        <ListBox value={selectedStarterIndefinite} options={starterIndefinite} onChange={(e) => setSelectedStarterIndefinite(e.value)} optionLabel="name"/>
                        <Button label={t('drop_package')} className="p-button-info" style={{ marginTop: "1rem" }}/>
                    </div>

                    <div className='col-3'>
                        <h5>{t('standart')}</h5>
                        <ListBox value={selectedStandart} options={standart} onChange={(e) => setSelectedStandart(e.value)} optionLabel="name"/>
                        <Button label={t('drop_package')} className="p-button-info" style={{ marginTop: "1rem" }}/>
                    </div>

                    <div className='col-3'>
                        <h5>{t('full')}</h5>
                        <ListBox value={selectedFull} options={full} onChange={(e) => setSelectedFull(e.value)} optionLabel="name"/>
                        <Button label={t('drop_package')} className="p-button-info" style={{ marginTop: "1rem" }}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
                 