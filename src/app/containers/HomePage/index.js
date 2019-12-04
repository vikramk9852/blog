import React, { Component } from 'react';
import { Avatar, Row, Col, Icon, Card } from 'antd';
import './index.scss';
import "antd/dist/antd.css";
import Loader from '../../components/Loader';
import { Images } from '../../constants/app-constants.js';
import styled, { keyframes } from 'styled-components';
import { bounceInLeft, bounceInRight } from 'react-animations';
const { Meta } = Card;
const BounceInLeft = styled.div`animation: 2s ${keyframes`${bounceInLeft}`} 1`;
const BounceInRight = styled.div`animation: 2s ${keyframes`${bounceInRight}`} 1`;

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.noOfTabs = 4;
        this.tabNames = ["Lifestyle", "Beauty", "Travel", "Other"];
        this.tabIcons = [
            Images.lifestyle,
            Images.beauty,
            Images.travel,
            Images.other
        ]
        this.state = {
            showLoader: true,
            tabDetails: []
        }
    }

    componentDidMount() {
        let tabDetails = [], tabs = [];
        let boxShadowWidth = 12, cardComponent;
        for (let i = 0; i < this.noOfTabs; i++) {
            cardComponent = <Col xl={12} lg={12} md={12} sm={24} xs={24} align="center" className="landing_page__tabs">
                <Card
                    className="landing_page__tabs__cards"
                    cover={
                        <img
                            alt="example"
                            src={this.tabIcons[i]}
                            height={150}

                        />
                    }
                    style={{ width: 300 }}
                    onClick={() => this.props.history.push(`storylist?${this.tabNames[i].toLowerCase()}`)}
                >
                    <Meta
                        title={this.tabNames[i]}
                    />
                </Card>
            </Col>;
            if (i % 2 === 0) {
                tabs.push(
                    <BounceInLeft>
                        {cardComponent}
                    </BounceInLeft>
                )
            }
            else {
                tabs.push(
                    <BounceInRight>
                        {cardComponent}
                    </BounceInRight>
                )
            }
        }
        tabDetails.push(
            <Row>{tabs}</Row>
        )
        this.setState({ tabDetails: tabDetails, showLoader: false });
    }

    render() {
        return (
            <div className="landing_page">
                {
                    this.state.showLoader ?
                        <Loader />
                        :
                        this.state.tabDetails
                }
            </div>
        )
    }
}

export default HomePage;
