import React, { Component } from 'react';
import { Input, Button } from 'antd';
import Loader from '../../components/Loader';
import Firebase from '../../utils/firebase';
import './index.scss';
import "antd/dist/antd.css";

class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false
        }
    }

    signIn = () => {
        let email = this.state.email;
        let password = this.state.password;
        // const firebase = new Firebase();
        // firebase.doPasswordReset("vikramk9852@gmail.com").then(console.log).catch(console.log)

        // firebase.doCreateUserWithEmailAndPassword("vikramk9852@gmail.com", "password").then(res => {
        //     console.log(res);
        // }).catch(err => {
        //     console.log(err);
        // })
    }

    render() {
        return (
            <div className="signin">
                <Input onChange={(e) => { this.setState({ email: e.target.value }) }} />
                <Input onChange={(e) => { this.setState({ password: e.target.value }) }} />
                <Button onClick={this.signIn}>Submit</Button>
            </div>
        )
    }
}

export default SignIn;
