import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { InputText } from 'primereact/inputtext';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useTranslation } from 'react-i18next';
import { Menubar } from 'primereact/menubar';
import './AppTopbar.css'
import NewDebtDialogue from "./pages/dialogues/NewDebtDialogue";
import NewClaimDialogue from "./pages/dialogues/NewClaimDialogue";
import NewCostDialogue from "./pages/dialogues/NewCostDialogue";
import NewPackageSaleDialogue from "./pages/dialogues/NewPackageSaleDialogue";
import NewProductSaleDialogue from "./pages/dialogues/NewProductSaleDialogue";
import NewCustomerDialogue from "./pages/dialogues/NewCustomerDialogue";
import NewCheckDialogue from "./pages/dialogues/NewCheckDialogue";
import NewAppointmentDialogue from "./pages/dialogues/NewAppointmentDialogue";
import { ClientRepresentativeDialogue } from "./pages/dialogues/ClientRepresentativeDialogue";
import * as actions from "./store/actions";
import { connect } from "react-redux";
import { AutoComplete } from "primereact/autocomplete";
import { CustomerService } from "./service/CustomerService";
import { ChangeLanguageDialogue } from "./pages/dialogues/ChangeLanguageDialogue";

const AppTopbar = (props) => {

    const { t, i18n } = useTranslation();
    let history = useHistory();

    const [newAppointmentDialogue, setNewAppointmentDialogue] = useState(false);
    const [newCheckDialogue, setNewCheckDialogue] = useState(false);
    const [newCustomerDialogue, setNewCustomerDialogue] = useState(false);
    const [newProductSaleDialogue, setNewProductSaleDialogue] = useState(false);
    const [newPackageSaleDialogue, setNewPackageSaleDialogue] = useState(false);
    const [newDebtDialogue, setNewDebtDialogue] = useState(false);
    const [newClaimDialogue, setNewClaimDialogue] = useState(false);
    const [newCostDialogue, setNewCostDialogue] = useState(false);
    const [clientRepresentativeDialog, setClientRepresentativeDialog] = useState(false);
    const [customer, setCustomer] = useState();
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [changeLanguageDialog, setChangeLanguageDialog] = useState(false);

    const customerService = new CustomerService();

    const items = [
        {
            icon: 'pi pi-bell'
        },
        {
            icon: 'pi pi-plus',
            items: [
                {
                    label: t('new_appointment'),
                    icon: 'pi pi-calendar',
                    command: () => { setNewAppointmentDialogue(true) }
                },
                {
                    label: t('new_check'),
                    icon: 'pi pi-pencil',
                    command: () => { setNewCheckDialogue(true) }
                },
                {
                    label: t('new_customer'),
                    icon: 'pi pi-user',
                    command: () => { setNewCustomerDialogue(true) }
                },
                {
                    label: t('new_product_sale'),
                    icon: 'pi pi-tags',
                    command: () => { setNewProductSaleDialogue(true) }
                },
                {
                    label: t('new_package_sale'),
                    icon: 'pi pi-table',
                    command: () => { setNewPackageSaleDialogue(true) }
                },
                {
                    label: t('new_cost'),
                    icon: 'pi pi-upload',
                    command: () => { setNewCostDialogue(true) }
                },
                {
                    label: t('new_claim'),
                    icon: 'pi pi-window-minimize',
                    command: () => { setNewClaimDialogue(true) }
                },
                {
                    label: t('new_debt'),
                    icon: 'pi pi-window-maximize',
                    command: () => { setNewDebtDialogue(true) }
                },
            ]
        },
        {
            icon: 'pi pi-cog',
            items: [
                {
                    label: t('general_information'),
                    icon: 'pi pi-info-circle',
                    command: () => { history.push('/basic-settings-page') }
                },
                {
                    label: t('working_hours'),
                    icon: 'pi pi-sun',
                    command: () => { history.push('/working-hours-page') }
                },
                {
                    label: t('employees'),
                    icon: 'pi pi-users',
                    command: () => { history.push('/employee-page') }
                },
                {
                    label: t('services'),
                    icon: 'pi pi-list',
                    command: () => { history.push('/services-page') }
                },
                {
                    label: t('service_durations'),
                    icon: 'pi pi-clock',
                    command: () => { history.push('/service-durations-page') }
                },
                {
                    label: t('service_prices'),
                    icon: 'pi pi-dollar',
                    command: () => { history.push('/service-prices-page') }
                },
                {
                    label: t('promotions'),
                    icon: 'pi pi-percentage',
                    command: () => { history.push('/promotions-page') }
                },
                {
                    label: t('products'),
                    icon: 'pi pi-tags',
                    command: () => { history.push('/products-page') }
                },
                {
                    label: t('packages'),
                    icon: 'pi pi-table',
                    command: () => { history.push('/packages-page') }
                },
                {
                    label: t('appointment_settings'),
                    icon: 'pi pi-calendar',
                    command: () => { history.push('/appointment-settings-page') }
                }
            ]
        },
        {
            label: props.userDetails["firstName"] + " " + props.userDetails["lastName"],
            icon: 'pi pi-user',
            items: [
                {
                    label: t('membership'),
                    icon: 'pi pi-shopping-cart',
                    command: () => { history.push('/membership-page') }
                },
                {
                    label: t('how_does_my_page_look_like'),
                    icon: 'pi pi-eye'
                },
                {
                    label: t('theme_settings'),
                    icon: 'pi pi-palette'
                },
                {
                    label: t('change_language'),
                    icon: 'pi pi-globe',
                    command: () => { setChangeLanguageDialog(true) }
                },
                {
                    label: t('change_password'),
                    icon: 'pi pi-key'
                },
                {
                    label: t('bills_2'),
                    icon: 'pi pi-file',
                    command: () => { history.push('/invoice-page') }
                },
                {
                    label: t('customer_service'),
                    icon: 'pi pi-question-circle',
                    command: () => { setClientRepresentativeDialog(true) }
                },
                {
                    label: t('logout'),
                    icon: 'pi pi-sign-out',
                    command: () => { props.onLogout() }
                }
            ]
        }
    ];

    const start = () =>
        <AutoComplete
            delay={500} minLength={3} value={customer} suggestions={filteredCustomers} field="fullName"
            completeMethod={searchCustomer} aria-label={t('person')} itemTemplate={itemTemplate}
            onChange={(e) => setCustomer(e.value)} placeholder={t('search_for_customer')}
            onSelect={(e) => {
                setCustomer("");
                setFilteredCustomers([]);
                props.history.push({ pathname: '/customer-details-page/' + e.value.id });
            }}
        />

    const searchCustomer = (event) => {
        customerService.getCustomersOfPartner(props.partnerId, event.query).then(data => {
            if (data.content && data.content.length > 0) {
                setFilteredCustomers(data.content);
            }
        })
    }

    const itemTemplate = (item) => {
        return (
            <div className='p-clearfix'>
                {item.fullName} - {item.phone}
            </div>
        );
    }

    return (
        <div className="layout-topbar">

            <ChangeLanguageDialogue visible={changeLanguageDialog} onHide={setChangeLanguageDialog} />
            <NewAppointmentDialogue
                visible={newAppointmentDialogue}
                onHide={setNewAppointmentDialogue}
            />
            <NewCheckDialogue visible={newCheckDialogue} onHide={setNewCheckDialogue} />
            <NewCustomerDialogue visible={newCustomerDialogue} onHide={setNewCustomerDialogue} />
            <NewProductSaleDialogue visible={newProductSaleDialogue} onHide={setNewProductSaleDialogue} />
            <NewPackageSaleDialogue visible={newPackageSaleDialogue} onHide={setNewPackageSaleDialogue} />
            <NewCostDialogue visible={newCostDialogue} onHide={setNewCostDialogue} />
            <NewDebtDialogue visible={newDebtDialogue} onHide={setNewDebtDialogue} />
            <NewClaimDialogue visible={newClaimDialogue} onHide={setNewClaimDialogue} />
            <ClientRepresentativeDialogue visible={clientRepresentativeDialog} onHide={setClientRepresentativeDialog} />

            <div style={{ display: "flex" }}>
                <div style={{ flex: "20%" }}><Link to="/home-page" className="layout-topbar-logo">
                    <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/goresy_logo.png' : 'assets/layout/images/goresy_logo.png'} alt="logo" />
                </Link></div>
                <div style={{ flex: "80%" }}><button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                    <i className="pi pi-bars" />
                </button></div>
            </div>

            <Menubar model={items} start={start} style={{ position: "absolute", right: "30px" }} />

        </div>
    );
}

const mapStateToProps = state => {
    return {
        userDetails: state.auth.userDetails,
        partnerId: state.auth.userDetails.partner.id
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AppTopbar));