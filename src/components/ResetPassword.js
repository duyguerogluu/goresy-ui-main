import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useTranslation } from 'react-i18next';
import { SelectButton } from 'primereact/selectbutton';
import { Checkbox } from 'primereact/checkbox';
import { connect } from "react-redux";
import * as actions from "../store/actions";
import { Toast } from "primereact/toast";
import { withTranslation } from "react-i18next";
import { withRouter } from 'react-router-dom'

export const ResetPassword = (props) => {

    const { t } = useTranslation();
    const toast = useRef(null);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const inputChangedHandler = (event) => {
        setEmail(event.target.value)
    }

    const submitHandler = (event) => {
        event.preventDefault();
        if (validateEmail(event.target.value)) {
            console.log(event.target.value);
        } else {
            setEmailError(true);
            setEmail('');
        }
    }

    const showErrorMessage = (summary, detail, severity, life) => {

    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    return (
        <div
            style={{ position: "absolute", maxWidth: "50rem", top: 0, bottom: 0, left: 0, right: 0, margin: "auto", marginTop: "15%" }}>
            <Toast ref={toast} />
            <div className="p-grid p-fluid p-justify-center">
                <div className="p-col-12 p-lg-12 p-md-6 p-sm-6">
                    <div className="card">
                        <div style={{ marginTop: '1rem', marginBottom: '1rem', textAlign: "center" }}>
                            <img src={'assets/layout/images/goresy_logo.png'} alt="logo" width={300} />
                        </div>
                        <div className="p-grid">
                            <h5 style={{ textAlign: "center", marginBottom: "2rem" }}>Şifremi Sıfırla</h5>
                            <small style={emailError ? { display: 'block' } : { display: 'none' }} className="p-error">{t('email_is_not_available')}</small>

                            <div className="p-col-12" style={{ marginBottom: ".5rem" }}>
                                <div className="p-col-12 ">
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-lock"></i>
                                        </span>
                                        <Password
                                            id={"password"}
                                            name={"password"}
                                            placeholder={t('password')}
                                            feedback={false}
                                            onChange={inputChangedHandler} toggleMask
                                            className={emailError ? "inputfield w-full p-invalid" : "inputfield w-full "}
                                        />
                                    </div>
                                </div>

                                <div className="p-col-12" style={{marginTop:0.5+'rem'}}>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-lock"></i>
                                        </span>
                                        <Password
                                            id={"password"}
                                            name={"password"}
                                            placeholder={t('password_again')}
                                            feedback={false}
                                            onChange={inputChangedHandler}
                                            className={emailError ? "inputfield w-full p-invalid" : "inputfield w-full "}
                                        />
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="p-col-12">
                            <Button
                                id={"sign_in_button"}
                                label='Şifremi Güncelle'
                                onClick={submitHandler}
                            />
                        </div>
                        <div className="field-checkbox" style={{ textAlign: "center", marginTop: "1rem" }}>
                            <label style={{ width: "100%" }} htmlFor="binary">{'Henüz hesabınız yoksa'}</label>
                        </div>
                        <div style={{ textAlign: "center", marginTop: "1rem" }}>
                            <a href="/registerPage">Kayıt Ol</a>
                        </div>
                        <div className="field-checkbox" style={{ textAlign: "center", marginTop: "1rem" }}>
                            <label style={{ width: "100%" }} htmlFor="binary">{'Hesabınız varsa'}</label>
                        </div>
                        <div style={{ textAlign: "center", marginTop: "1rem" }}>
                            <a href="#/login">Giriş Yap</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ResetPassword;