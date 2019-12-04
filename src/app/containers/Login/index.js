import React, { Component } from 'react';
import { Input, Button, Form, Icon, Checkbox, message } from 'antd';
import Loader from '../../components/Loader';
import Firebase from '../../utils/firebase';
import './index.scss';
import "antd/dist/antd.css";

const loginText = "Login using your registered email and password";
const resetText = "Enter your registered email to reset password";
const resetLinkText = "A reset link has been sent to your registered email id, use that link to reset your password";
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.initState = {
            showLoader: false,
            resetPassword: false,
            resetLinkSent: false,
            toGoBack: false
        }
        this.state = this.initState
    }

    componentDidMount() {
        let firebase = Firebase.getInstance();
        let user = firebase.getAuth().getCurrentUser();
        if (user) {
            this.props.history.goBack();
        }
        let path = this.props.history.location.search;
        if (path.includes('state')) {
            this.setState({ toGoBack: true });
        }
    }

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({ showLoader: true }, () => {
                let firebase = Firebase.getInstance();
                if (this.state.resetPassword) {
                    firebase.getAuth().resetPassword(values.email).then(res => {
                        this.setState({ showLoader: false, resetLinkSent: true });
                    }).catch(err => {
                        message.error(err.message);
                        this.setState({ showLoader: false });
                    })
                }
                else {
                    firebase.getAuth().logIn(values.email, values.password).then(res => {
                        message.success("Successfully logged in");
                        this.setState({ showLoader: false });
                        if (this.state.toGoBack) {
                            this.props.history.goBack();
                        }
                        this.props.history.push('/admin');
                    }).catch(err => {
                        message.error(err.message);
                        this.setState({ showLoader: false });
                    })
                }
            })
        })
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                {
                    this.state.showLoader ?
                        <Loader />
                        :
                        this.state.resetLinkSent ?
                            <div className="login__form">
                                <p>{resetLinkText}</p>
                                <a onClick={() => this.setState(this.initState)}>Go back to Login page</a>
                            </div>
                            :
                            <div className="login__form">
                                <h3 className="login__form__heading">{this.state.resetPassword ? resetText : loginText}</h3>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Item style={{ marginBottom: "1em" }}>
                                        {getFieldDecorator('email', {
                                            rules: [{ required: true, message: 'Please input your email!' }],
                                        })(
                                            <Input
                                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                placeholder="Username"
                                            />,
                                        )}
                                    </Form.Item>
                                    {
                                        !this.state.resetPassword ?
                                            <div>
                                                <Form.Item>
                                                    {getFieldDecorator('password', {
                                                        rules: [{ required: true, message: 'Please input your Password!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            type="password"
                                                            placeholder="Password"
                                                            onPressEnter={this.handleSubmit}
                                                        />,
                                                    )}
                                                </Form.Item>
                                                <Form.Item>
                                                    {getFieldDecorator('remember', {
                                                        valuePropName: 'checked',
                                                        initialValue: true,
                                                    })(<Checkbox>Remember me</Checkbox>)}
                                                    <a className="login__form__forgot" onClick={() => this.setState({ resetPassword: true })}>
                                                        Forgot password
                                                </a>
                                                    <br />
                                                </Form.Item>
                                            </div>
                                            :
                                            <div className="login__form__goback">
                                                <a onClick={() => this.setState(this.initState)}>
                                                    Go Back
                                                </a>
                                                <br />
                                            </div>
                                    }
                                    <Button type="primary" onClick={this.handleSubmit} className="login__form__button">
                                        {!this.state.resetPassword ? "Log in" : "Reset Password"}
                                    </Button>
                                </Form>
                            </div>
                }
            </div>
        );
    }
}

const LoginForm = Form.create({ name: 'normal_login' })(Login);
export default LoginForm;