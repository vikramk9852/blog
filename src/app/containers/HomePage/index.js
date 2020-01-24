import React, { Component } from 'react';
import { Typography, Row, Col, Avatar, Icon } from 'antd';
import './index.scss';
import "antd/dist/antd.css";
import Loader from '../../components/Loader';
import StoryListing from '../StoryListing';
import FastAverageColor from 'fast-average-color';
import Firebase from '../../utils/firebase';
import BackgroundImage from '../../../assets/images/background.jpg';
import { homepageDescription, homepageTitle } from '../../constants/app-constants';

const { Paragraph, Title } = Typography
const fac = new FastAverageColor();

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoader: true,
            profile: {}
        }
    }

    componentWillMount() {
        this.fetchDetails();
    }

    fetchDetails = () => {
        let firebase = Firebase.getInstance();
        firebase.getDB().getDataBypath('profile').then(profile => {
            this.setState({ profile: profile.val() });
        })
    }

    hideLoader = () => {
        this.setState({ showLoader: false });
    }

    renderPage = () => {
        return (
            <Row className="landing_page__row">
                {
                    this.state.showLoader ?
                        <Loader />
                        :
                        <Col xl={12} lg={12} md={12} sm={24} xs={24} className="landing_page__about">
                            <Row>
                                <Title>
                                    {this.state.profile.profile_name}
                                </Title>
                                <div style={{ textAlign: 'center', margin: '2em -1em' }}>
                                    {/* <Avatar align="center" className="landing_page__avatar" size={300} src={this.state.profile.profile_image} /> */}
                                    <img className="landing_page__about_image" src={this.state.profile.profile_image} />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <a href="https://www.github.com/vikramk9852"><Icon className="landing_page__icon" type="github" /></a>
                                    <a href="https://www.linkedin.com/vikramk9852"><Icon className="landing_page__icon" type="linkedin" /></a>
                                    <a href="https://www.twitter.com/vikramk9852"><Icon className="landing_page__icon" type="twitter" /></a>
                                    <a href="#"><Icon className="landing_page__icon" type="mail" /></a>
                                </div>
                                <Paragraph>
                                    {this.state.profile.profile_description}
                                </Paragraph>
                            </Row>
                        </Col>
                }
                <Col xl={12} lg={12} md={12} sm={24} xs={24} className="landing_page__listing">
                    <StoryListing hideLoader={this.hideLoader} />
                </Col>
            </Row>
        )
    }

    render() {
        return (
            <div className="landing_page">

                <div>
                    {/* <img src={BackgroundImage} className="landing_page__background_image" /> */}
                    {this.renderPage()}
                </div>
            </div>
        )
    }
}

export default HomePage;
