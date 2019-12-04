import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Row, Col, Avatar, message } from 'antd';
import Menu from '../CustomDropDown';
import Firebase from '../../utils/firebase';
import './index.scss';
const paths = ["admin", "editor?new", "profile", "login"];

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imgUrl: ""
        }
    }

    componentDidMount() {
        let firebase = Firebase.getInstance();
        firebase.getDB().getDataBypath('profile').then(res => {
            res = res.val();
            this.setState({ imgUrl: res.profile_image })
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