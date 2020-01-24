import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Row, Col, Avatar, message } from 'antd';
import Menu from '../CustomDropDown';
import Firebase from '../../utils/firebase';
import Utils from '../../utils/utils';
import './index.scss';
const paths = ["admin", "editor?new", "profile", "login"];

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Utils.getFromLocalStorage('profile_image')
        }
    }

    componentDidMount() {
        this.listenForProfileUpdate();
    }

    listenForProfileUpdate = () => {
        let that = this;
        let firebase = Firebase.getInstance();
        let firebaseApp = firebase.getFirebaseApp();
        let profileRef = firebaseApp.database().ref("profile");
        profileRef.on('value', function (snapshot) {
            let profile = snapshot.val();
            Utils.getBase64Image(profile.profile_image, function (base64image) {
                localStorage.setItem("profile_image", base64image);
                that.setState({ imgUrl: base64image });
            });
        })
    }

    handleClick = (key) => {
        // console.log(key)
        if (Number(key) === 3) {
            let firebase = Firebase.getInstance();
            firebase.getAuth().logOut().then(res => {
                this.props.history.push('/login');
            }).catch(err => {
                message.error("Some error occured");
            })
        }
        this.props.history.push(`/${paths[key]}`);
    }

    render() {
        return (
            <div className="header">
                <Row className="header__content">
                    <Col span={12}>
                        <div className=""><Avatar src={this.state.imgUrl} /></div>
                    </Col>
                    <Col span={12} align="right">
                        <div className="header__profileIcon">
                            <Menu
                                handleClick={this.handleClick}
                                menuItem={["Home", "New Story", "Profile", "Logout"]}
                                menuHolder="icon"
                                iconType="setting"
                                iconSize="20px"
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withRouter(Header);