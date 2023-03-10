import React, { Component } from 'react';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import { SelectButton } from 'primereact/selectbutton';
import { Checkbox } from 'primereact/checkbox';
import {connect} from "react-redux";
import * as actions from "../store/actions";
import {Toast} from "primereact/toast";
import {withTranslation} from "react-i18next";
import {withRouter} from 'react-router-dom'

class LoginPage extends Component {
    
    state = {
        entry: {
            email: "",
            phone_number: "",
            username: "",
            password: "",
        },
        emptyEntry: {
            email: false,
            phone_number: false,
            username: false,
            password: false
        },
        emptyUsername: false,
        emptyPassword: false,
        submitted: false,
        selection: 'email',
        phone: null,
        email: null,
        checkedRemember: false,
        checkedNotify: false,
        language: "tr"
    };

    loginOptions = [
        {label: 'E-Posta Adresi', value: 'email'},
        {label: 'Telefon Numarası', value: 'phone_number'},
        {label: 'Kullanıcı Adı', value: 'username'},
    ];

    inputChangedHandler = (event) => {
        let newState = {...this.state};
        newState.entry[event.target.name] = event.target.value;
        newState.emptyEntry[event.target.name] = false;
        this.setState(newState);
    }

    submitHandler = ( event ) => {
        event.preventDefault();
        this.setState({
            ...this.state,
            submitted: true
        });

        if (this.state.entry[this.state.selection] === '') {
            let newState = {...this.state};
            newState.emptyEntry[this.state.selection] = true;
            this.setState(newState);

            this.showErrorMessage('sign_in_failed', 'empty_' + this.state.selection);
        }

        else if (this.state.entry["password"] === '') {
            this.setState({
                ...this.state,
                emptyEntry: {
                    ...this.state.emptyEntry,
                    password: true
                }
            });

            this.showErrorMessage('sign_in_failed', 'empty_password');
        }

        else {
            this.props.onAuth(this.state.entry[this.state.selection], this.state.entry.password);
            this.props.history.push(this.props.authRedirectPath)
        }
    }

    showErrorMessage(summary, detail, severity, life) {
        const { t } = this.props;

        this.toast.show({
            severity: severity || 'warn',
            summary: t(summary),
            detail: t(detail),
            life: life
        });
    }

    componentDidUpdate () {
        if (this.props.error && this.state.submitted) {
            this.showErrorMessage('sign_in_failed', this.props.error + "_" + this.state.selection, 'error', 5000);
            this.setState({
                ...this.state,
                submitted: false
            });
        }
    }

    componentDidMount() {
        const { i18n } = this.props;

        if (i18n.language) {
            this.setState({
                ...this.state,
                language: i18n.language
            })
        }
    }

    render() {
        const { t } = this.props;

        const loginOptionsInput = {
            "username": (
                <div className="p-inputgroup" style={{ marginBottom:".5rem"}}>
                    <span className="p-inputgroup-addon" ><i className="pi pi-user" /></span>
                    <InputText
                        id={"username"}
                        name={"username"}
                        placeholder={t('username')}
                        inputMode={"text"}
                        keyfilter={"alphanum"}
                        value={this.state.entry.username}
                        onChange={this.inputChangedHandler}
                        className={this.state.emptyEntry["username"] ? "p-invalid p-d-block" : ""}
                    />
                </div>
            ),
            "phone_number": (
                <div className="p-inputgroup" style={{ marginBottom:".5rem"}}>
                    <span className="p-inputgroup-addon" ><i className="pi pi-phone" /></span>
                    <InputText
                        id={"phone_number"}
                        name={"phone_number"}
                        placeholder={t('phone_number')}
                        inputMode={"tel"}
                        keyfilter={"pnum"}
                        value={this.state.entry.phone_number}
                        onChange={this.inputChangedHandler}
                        className={this.state.emptyEntry["phone_number"] ? "p-invalid p-d-block" : ""}
                    />
                </div>
            ),
            "email": (
                <div className="p-inputgroup" style={{ marginBottom:".5rem"}}>
                    <span className="p-inputgroup-addon" ><i className="pi pi-at" /></span>
                    <InputText
                        id={"email"}
                        name={"email"}
                        placeholder={t('email')}
                        inputMode={"email"}
                        keyfilter={"email"}
                        value={this.state.entry.email}
                        onChange={this.inputChangedHandler}
                        className={this.state.emptyEntry["email"] ? "p-invalid p-d-block" : ""}
                    />
                </div>
            ),
        }

        return (
            <div
            style={{position: "absolute",  maxWidth: "50rem", top:0, bottom:0, left:0, right:0, margin: "auto",marginTop: "15%" }}>
                <Toast ref={(el) => this.toast = el} />
                <div className="p-grid p-fluid p-justify-center">
                    <div className="p-col-12 p-lg-12 p-md-6 p-sm-6">
                        <div className="card">
                            <div style={{marginTop: '1rem', marginBottom: '1rem', textAlign: "center"}}>
                                <img src={'assets/layout/images/goresy_logo.png'} alt="logo" width={300} />
                            </div>
                            <div className="p-grid">
                            <h5 style={{ textAlign:"center", marginBottom:"2rem"}}>Kullanıcı Girişi</h5>
                                <SelectButton value={this.state.selection} options={this.loginOptions} onChange={(e) => this.setState({ selection: e.value })} style={{ marginBottom:".5rem"}}/>
                                {loginOptionsInput[this.state.selection]}
                                <div className="p-col-12" style={{ marginBottom:".5rem"}}>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon"><i className="pi pi-lock" /></span>
                                        <Password
                                            id={"password"}
                                            name={"password"}
                                            placeholder={t('password')}
                                            feedback={false}
                                            onChange={this.inputChangedHandler}
                                            className={this.state.emptyEntry["password"] ? "p-invalid p-d-block" : ""}
                                        />
                                    </div>
                                </div>
                                <div className="field-checkbox" style={{ marginBottom:"1rem", marginTop:"2rem"}}>
                                    <Checkbox inputId="binary" checked={this.state.checkedRemember} onChange={e => this.setState({ checkedRemember: e.checked })} />
                                    <label htmlFor="binary" style={{width: "100%"}}>{'Beni Hatırla'}</label>
                                    <a href="#/forgotPassword" style={{textAlign: "right", width: "100%"}}>Şifremi Unuttum</a>
                                </div>
                                <div className="field-checkbox" style={{ marginBottom:"1rem", marginTop:"1rem"}}>
                                    <Checkbox inputId="binary" checked={this.state.checkedNotify} onChange={e => this.setState({ checkedNotify: e.checked })} />
                                    <label htmlFor="binary" style={{width: "100%"}}>{'GoResy ticari iletilerini almak istiyorum'}</label>
                                </div>
                                <div className="field-checkbox" style={{ marginBottom:"1rem", marginTop:"1rem"}}>
                                    <label htmlFor="binary">{'Sisteme giriş yaparak kabul etmiş sayılırsınız: '}
                                        <a href="/politika.php">Kullanım koşulları ve gizlilik politikası</a>
                                    </label>
                                </div>
                                <div className="p-col-12">
                                    <Button
                                        id={"sign_in_button"}
                                        label='Giriş Yap'
                                        onClick={this.submitHandler}
                                    />
                                </div>
                                <div className="field-checkbox" style={{textAlign: "center", marginTop:"1rem"}}>
                                    <label style={{width: "100%"}} htmlFor="binary">{'Henüz hesabınız yoksa'}</label>
                                </div>
                                <div style={{textAlign: "center", marginTop:"1rem"}}>
                                    <a href="/registerPage">Kayıt Ol</a> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: ( username, password ) => dispatch( actions.auth( username, password ) )
    };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( withTranslation()(LoginPage) ));
