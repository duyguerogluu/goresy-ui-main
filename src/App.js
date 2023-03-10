import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Route, useLocation } from 'react-router-dom';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';

import AppTopbar from './AppTopbar';

import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppConfig } from './AppConfig';

import CalendarPage from './pages/CalendarPage';
import HomePage from './pages/HomePage';
import LoginPage from './components/LoginPage';
import ForgotPassword from './components/ForgotPassword';
import ReservationPage  from './pages/ReservationPage';
import ReservationDetailPage from './components/ReservationDetailPage';
import CheckDetailsPage from './pages/CheckDetailsPage';
import CustomerPage from './pages/CustomerPage';
import { CustomerDetailsPage } from './pages/CustomerDetailsPage';
import CustomerReservationPage from './pages/CustomerReservationPage';
import CustomerRewardPoints from './pages/CustomerRewardPoints';
import CustomerProductSales from './pages/CustomerProductSales';
import StaffPage from './pages/StaffPage';
import EmployeePage from './pages/EmployeePage';
import CustomerPackageSales from './pages/CustomerPackageSales';
import CustomerDebts from './pages/CustomerDebts';
import CustomerReviewPage from './pages/CustomerReviewPage';
import CustomerPayments from './pages/CustomerPayments';
import CustomerFiles from './pages/CustomerFiles';
import CustomerPhotos from './pages/CustomerPhotos';
import ProductSalesPage from './pages/ProductSalesPage';
import WorkingHoursPage from './pages/WorkingHoursPage';
import PackageSalesPage from './pages/PackageSalesPage';
import { StaffReportPage } from './pages/StaffReportPage';
import { Comments } from './pages/Comments';
import ServicesPage from './pages/ServicesPage';
import BasicSettingsPage from './pages/BasicSettingsPage';
import ServiceDurationsPage from './pages/ServiceDurationsPage';
import ServicePricesPage from './pages/ServicePricesPage';
import ProductsPage from './pages/ProductsPage';
import PromotionsPage from './pages/PromotionsPage';
import InvoicePage from './pages/InvoicePage';
import PackagesPage from './pages/PackagesPage';
import { MembershipPage } from './pages/MembershipPage';
import AppointmentSettingsPage from "./pages/AppointmentSettingsPage";
import { PartnerListPage } from "./pages/admin/PartnerListPage";
import { InvoiceListPage } from "./pages/admin/InvoiceListPage";
import {StaffListPage} from "./pages/admin/StaffListPage";
import ReservationComissionsPage from "./pages/ReservationComissionsPage";

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';
import { ProgressSpinner } from 'primereact/progressspinner';

import { useTranslation } from 'react-i18next';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/layout/layout.scss';
import './App.scss';
import './App.css'
import * as actions from "./store/actions";
import {connect} from "react-redux";
import ChecksPage from "./pages/ChecksPage";

import { locale, addLocale, localeOptions } from 'primereact/api';
import {AppointmentService} from "./service/AppointmentService";
import AwaitingAppointmentDialogue from "./pages/dialogues/AwaitingAppointmentDialogue";
import ResetPassword from './components/ResetPassword';
import {isAuthorized} from "./shared/utility";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { SettingsPage } from './pages/admin/SettingsPage';

const App = (props) => {

    const { t, i18n } = useTranslation();
    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const [appointmentApproveDialog, setAppointmentApproveDialog] = useState(false);
    const [awaitingAppointments, setAwaitingAppointments] = useState([]);
    const copyTooltipRef = useRef();
    const location = useLocation();

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;
    const appointmentService = new AppointmentService();

    useEffect(() => {
        addLocale('en-US', localeOptions('en'));
        addLocale('tr', {
            firstDayOfWeek: 1,
            dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
            dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
            dayNamesMin: ['Pa', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
            monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
            monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
            startsWith: "Bununla Başlar",
            contains: "Bunu İçerir",
            notContains: "Bunu İçermez",
            endsWith: "Bununla Biter",
            equals: "Buna Eşit",
            notEquals: "Buna Eşit Değil",
            noFilter: "Filtre Yok",
            lt: "Bundan Küçük",
            lte: "Bundan Küçük veya Eşit",
            gt: "Bundan Büyük",
            gte: "Bundan Büyük veya Eşit",
            dateIs: "Tarih Budur",
            dateIsNot: "Tarih Bu Değildir",
            dateBefore: "Tarih Bundan Öncedir",
            dateAfter: "Tarih Bundan Sonradır",
            custom: "Özel",
            clear: "Temizle",
            apply: "Uygula",
            matchAll: "Hepsini Karşılar",
            matchAny: "Herhangi Birini Karşılar",
            addRule: "Kural Ekle",
            removeRule: "Kural Sil",
            accept: "Evet",
            reject: "Hayır",
            choose: "Seç",
            upload: "Yükle",
            cancel: "İptal",
            today: "Bugün",
            weekHeader: "Hf",
            dateFormat: "gg/aa/yy",
            weak: "Zayıf",
            medium: "Orta",
            strong: "Güçlü"
        });

        props.onTryAutoSignup();
    }, []);

    useEffect(() => {
        locale(i18n.language || 'tr');
    }, [i18n.language])

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    useEffect(() => {
        if (props.partner) {
            const today = new Date();

            const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            startDate.setHours(0);
            startDate.setMinutes(0);
            const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            endDate.setHours(23);
            endDate.setMinutes(59);

            appointmentService.getAppointments(props.partner.id, startDate, endDate)
                .then(data => {
                    const awaitingAppointments = data.content
                        .filter(appointment => appointment.appointmentStatus === 'waiting_for_approval');
                    if (awaitingAppointments && awaitingAppointments.length > 0) {
                        setAwaitingAppointments(awaitingAppointments);
                        setAppointmentApproveDialog(true)
                    }
                });
        }
    }, [props.partner]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const onMenuConstruction = () => {
        let menu = [
            {
                items: [
                    { label: t('home'), icon: 'pi pi-fw pi-home', to: '/home-page' },
                    isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ? { label: t('appointment_calendar'), icon: 'pi pi-fw pi-calendar', to: '/calendar-page' } : {},
                    isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ? { label: t('appointments'), icon: 'pi pi-fw pi-clock', to: "/reservation-page"  } : {},
                    isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ? { label: t('bills'), icon: "pi pi-fw pi-list", to: "/checks-page" } : {},
                    isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ? { label: t('customers'), icon: "pi pi-fw pi-user", to: "/customer-page"} : {},
                    isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ? { label: t('product_sales'), icon: 'pi pi-fw pi-tags', to:"/product-sales-page"} : {},
                    isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ? { label: t('package_sales'), icon: 'pi pi-fw pi-table', to:"/package-sales-page"} : {},
                    isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ? { label: t('reports'), icon: 'pi pi-fw pi-chart-line',
                        items: [
                            {
                                label: t('cashier_reports'),
                                icon: 'pi pi-wallet',
                                to: "/cashier-report-page"
                            },
                            {
                                label: t('staff_reports'),
                                icon: 'pi pi-users',
                                to: "/staff-report-page"
                            },
                            {
                                label: t('sales_reports'),
                                icon: 'pi pi-money-bill',
                                to: "/sales-report-page"
                            }
                        ]
                    } : {},
                    isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ? { label: t('other'), icon: 'pi pi-fw pi-ellipsis-v',
                        items: [
                            {
                                label: t('custom_sms'),
                                icon: 'pi pi-envelope',
                            },
                            {
                                label: t('booking_commissions'),
                                icon: 'pi pi-percentage',
                                to: "/reservation-commissions-page"
                            },
                            {
                                label: t('quotations'),
                                icon: 'pi pi-question',
                            },
                            {
                                label: t('reviews'),
                                icon: 'pi pi-comment',
                                to: "/comments"
                            },
                            {
                                label: t('call_logs'),
                                icon: 'pi pi-phone',
                            },
                            {
                                label: t('costs'),
                                icon: 'pi pi-upload',
                            },
                            {
                                label: t('collections'),
                                icon: 'pi pi-download',
                            },
                            {
                                label: t('receivables'),
                                icon: 'pi pi-window-minimize',
                            },
                            {
                                label: t('debts'),
                                icon: 'pi pi-window-maximize',
                            }
                        ]
                    } : {},
                    isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ? { label: t('administration'), icon: 'pi pi-fw pi-sitemap',
                        items: [
                            {
                                label: t('partners'),
                                icon: 'pi pi-database',
                                to: "/admin/partners-page"
                            },
                            {
                                label: t('invoices'),
                                icon: 'pi pi-money-bill',
                                to: "/admin/partners-invoices"
                            },
                        ]
                    } : {},
                ]
            }
        ];

        menu[0].items = menu[0].items.filter(item => item.label)

        return menu;
    }

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (
        <div>
            <Switch>
                <Route path='/'>
                    <div className={wrapperClass} onClick={onWrapperClick}>
                        {props.loading ? (
                            <div className='w-full h-screen flex'>
                                <ProgressSpinner className='m-auto'/>
                            </div>
                        ) : props.isAuthenticated ? (
                            <div>
                                <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />
                                 <AppTopbar
                                    onToggleMenuClick={onToggleMenuClick} 
                                    layoutColorMode={layoutColorMode}
                                    mobileTopbarMenuActive={mobileTopbarMenuActive} 
                                    onMobileTopbarMenuClick={onMobileTopbarMenuClick} 
                                    onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} 
                                />

                                <AwaitingAppointmentDialogue awaitingAppointments={awaitingAppointments}
                                                             visible={appointmentApproveDialog}
                                                             onHide={() => {setAppointmentApproveDialog(false)}}
                                />
                                <div className="layout-sidebar" onClick={onSidebarClick}>
                                    <AppMenu model={onMenuConstruction()} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
                                </div>

                                <div className="layout-main-container">
                                    <div className="layout-main">
                                        <Route path="/home-page" component={HomePage} />
                                        <Route path='/unauthorized' component={UnauthorizedPage} />
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path="/calendar-page" component={CalendarPage} /> :
                                            <Route path='/reservation-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/reservation-page' component={ReservationPage} /> :
                                            <Route path='/reservation-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/checks-page' component={ChecksPage} /> :
                                            <Route path='/checks-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/reservation-detail-page/:id' component={ReservationDetailPage} /> :
                                            <Route path='/reservation-detail-page/:id' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/check-details-page/:id' component={CheckDetailsPage} /> :
                                            <Route path='/check-details-page/:id' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/customer-page' component={CustomerPage} /> :
                                            <Route path='/customer-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/customer-details-page/:id' component={CustomerDetailsPage} /> :
                                            <Route path='/customer-details-page/:id' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/customer-reservation-page/:id' component={CustomerReservationPage} /> :
                                            <Route path='/customer-reservation-page/:id' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/customer-reward-points/:id' component={CustomerRewardPoints} /> :
                                            <Route path='/customer-reward-points/:id' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/customer-product-sales/:id' component={CustomerProductSales} /> :
                                            <Route path='/customer-product-sales/:id' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/staff-page' component={StaffPage} /> :
                                            <Route path='/staff-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/employee-page' component={EmployeePage} /> :
                                            <Route path='/employee-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/customer-package-sales/:id' component={CustomerPackageSales} /> :
                                            <Route path='/customer-package-sales/:id' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/customer-debts/:id' component={CustomerDebts} /> :
                                            <Route path='/customer-debts/:id' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/customer-reviews/:id' component={CustomerReviewPage} /> :
                                            <Route path='/customer-reviews/:id' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/customer-payments/:id' component={CustomerPayments} /> :
                                            <Route path='/customer-payments/:id' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/customer-files/:id' component={CustomerFiles} /> :
                                            <Route path='/customer-files/:id' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/customer-photos/:id' component={CustomerPhotos} /> :
                                            <Route path='/customer-photos/:id' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/product-sales-page' component={ProductSalesPage} /> :
                                            <Route path='/product-sales-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/working-hours-page' component={WorkingHoursPage} /> :
                                            <Route path='/working-hours-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/package-sales-page' component={PackageSalesPage} /> :
                                            <Route path='/package-sales-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/staff-report-page' component={StaffReportPage} /> :
                                            <Route path='/staff-report-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/comments' component={Comments} /> :
                                            <Route path='/comments' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/services-page' component={ServicesPage} /> :
                                            <Route path='/services-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/basic-settings-page' component={BasicSettingsPage} /> :
                                            <Route path='/basic-settings-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/promotions-page' component={PromotionsPage} /> :
                                            <Route path='/promotions-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/appointment-settings-page' component={AppointmentSettingsPage} /> :
                                            <Route path='/appointment-settings-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/service-durations-page' component={ServiceDurationsPage} /> :
                                            <Route path='/service-durations-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/service-prices-page' component={ServicePricesPage} /> :
                                            <Route path='/service-prices-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/products-page' component={ProductsPage} /> :
                                            <Route path='/products-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/invoice-page' component={InvoicePage} /> :
                                            <Route path='/invoice-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/packages-page' component={PackagesPage} /> :
                                            <Route path='/packages-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/membership-page' component={MembershipPage} /> :
                                            <Route path='/membership-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/admin/partners-page' component={PartnerListPage} /> :
                                            <Route path='/admin/partners-page' component={UnauthorizedPage} />}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/admin/partners-invoices' component={InvoiceListPage}/> :
                                            <Route path='/admin/partners-invoices' component={UnauthorizedPage}/>}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/admin/partners-settings/:partnerId' component={SettingsPage}/> :
                                            <Route path='/admin/partners-settings/:partnerId' component={UnauthorizedPage}/>}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/admin/partners-staff-list/:partnerId' component={StaffListPage}/> :
                                            <Route path='/admin/partners-staff-list/:partnerId' component={UnauthorizedPage}/>}
                                        {isAuthorized(props.userDetails.authorities, "VIEW_CALENDAR") ?
                                            <Route path='/reservation-commissions-page' component={ReservationComissionsPage} /> :
                                            <Route path='/reservation-commissions-page' component={UnauthorizedPage} />}
                                    </div>
                                <AppFooter layoutColorMode={layoutColorMode} />
                                </div>
                            </div>
                        ) : (
                            <Switch>
                                <Route path='/forgotPassword' component={ForgotPassword} />
                                <Route path='/resetPassword/:resetToken' component={ResetPassword} />
                                <Route path="/*" component={LoginPage} />
                            </Switch>
                        )
                        }
                        <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                                   layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />
                    </div>
                </Route>
            </Switch>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        partner: state.auth.userDetails && state.auth.userDetails.partner,
        isAuthenticated: state.auth.token !== null,
        userDetails: state.auth.userDetails,
        loading: state.auth.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)((App));
