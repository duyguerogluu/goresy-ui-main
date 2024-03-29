import React from 'react';
import { useTranslation } from 'react-i18next';

const UnauthorizedPage = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-column align-items-center justify-content-center">
            <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                    <div className="flex justify-content-center align-items-center bg-pink-500 border-circle" style={{ height: '3.2rem', width: '3.2rem' }}>
                        <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                    </div>
                    <h1 className="text-900 font-bold text-5xl mb-2">{t('unauthorized')}</h1>
                    <div className="text-600 mb-5">{t('unauthorized_explanation')}</div>
                </div>
            </div>
        </div>
    );
};

UnauthorizedPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
}

export default UnauthorizedPage;