import React, { Component } from 'react';
import { Row, Col, Card, Icon, Typography } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../../components/Loader';
import Firebase from '../../utils/firebase';
import styled, { keyframes } from 'styled-components';
import { slideInLeft, slideInRight } from 'react-animations';
import Utils from '../../utils/utils';
import './index.scss';
import "antd/dist/antd.css";
import Meta from 'antd/lib/card/Meta';

const { Paragraph, Title } = Typography;
const SlideInLeft = styled.div`animation: 1s ${keyframes`${slideInLeft}`} 1`;
const SlideInRight = styled.div`animation: 1s ${keyframes`${slideInRight}`} 1`;
class StoryListing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: "0",
            showLoader: true
        }
    }

    componentDidMount() {
        let url = this.props.location.search;
        let urlInfo = url.split('?');
        this.category = urlInfo[1];
        let path = `published/${urlInfo[1]}`;
        this.fetchStoryList(path);
    }

    fetchStoryList = (path) => {
        let firebase = Firebase.getInstance();
        firebase.getDB().getDataBypath(path).then(stories => {
            stories = stories.val();
            let storyList = [], storyComponent, index = 0;
            for (let story in stories) {
                storyComponent = this.createStoryComponent(stories[story]);
                if (++index % 2 === 0) {
                    storyList.push(
                        <SlideInLeft>
                            {storyComponent}
                        </SlideInLeft>
                    )
                }
                else {
                    storyList.push(
                        <SlideInRight>
                            {storyComponent}
                        </SlideInRight>
                    )
                }
                // storyList.push(storyComponent);
            }
            this.setState({ storyList: storyList, showLoader: false });
        }).catch(() => {
            this.setState({ showLoader: false, switchTabLoader: false });
        })
    }

    openStory(storyId, category) {
        let path = `story?published?${category}?${storyId}`;
        this.props.history.push(path);
    }

    createStoryComponent = (story) => {
        let avatarUrl = story.blog_avatar_url;
        let blogCategory = story.blog_category;
        let blogPublished = new Date(story.blog_publish_date);
        let publishedDate = blogPublished.getDate();
        let publishedMonth = blogPublished.getMonth();
        publishedDate = Utils.getMonth(publishedMonth);
        let blogDescription = story.blog_description;
        let statsOptions = {
            wordsPerMinute: 100
        }

        // return (
        //     <Row className="storylist__row">
        //         <Col xl={19} lg={19} md={19} sm={19} xs={16} className="storylist__box">
        //             {story.blog_title}
        //         </Col>
        //         <Col xl={5} lg={5} md={5} sm={5} xs={8} className="storylist__image">
        //             <img src={avatarUrl} />
        //         </Col>
        //     </Row>
        // )
        const stats = 5;
        // blogDescription = blogDescription.substr(0, 250);
        // console.log(window.innerWidth)
        let titleLevel = 4;
        let titleEllipsis = 1;

        return (
            <Card
                className="storylist__row"
                cover={
                    <img
                        className="storylist__image"
                        alt="cover"
                        src={avatarUrl}
                        onClick={() => this.openStory(story.id, story.blog_category)}
                    />
                }
            >
                <Meta
                    title={
                        <Title
                            style={{ cursor: "pointer" }}
                            level={titleLevel}
                            ellipsis={{ rows: titleEllipsis }}
                            onClick={() => this.openStory(story.id, story.blog_category)}
                        >
                            {story.blog_title}
                        </Title>
                    }
                    description={
                        <div>
                            <Paragraph
                                style={{ cursor: "pointer", margin: 0 }}
                                ellipsis={{ rows: 2 }}
                                onClick={() => this.openStory(story.id, story.blog_category)}
                            >
                                {blogDescription}
                            </Paragraph>
                            <p className="storylist__publishdate">{`${publishedDate}  ${publishedMonth} · ${parseInt(stats)} min read `}<Icon type="star" theme="filled" /></p>

                        </div>
                    }
                />
            </Card>
        )

        return (
            <Row className="storylist__row">
                <Col xl={18} lg={18} md={18} sm={18} xs={16} className="storylist__box">
                    <Title style={{ cursor: "pointer" }} level={titleLevel} ellipsis={{ rows: titleEllipsis }} onClick={() => this.openStory(story.id, story.blog_category)}>{story.blog_title}</Title>
                    <Paragraph style={{ cursor: "pointer" }} ellipsis={{ rows: 2 }} onClick={() => this.openStory(story.id, story.blog_category)}>{blogDescription}</Paragraph>

                    {/* <p className="storylist__box__category"><Tag>{blogCategory}</Tag></p> */}
                    <p className="storylist__box__publish__date">{`${publishedDate}  ${publishedMonth} · ${parseInt(stats)} min read `}<Icon type="star" theme="filled" /></p>
                    {/* <Col span={12} align="right" className="storylist__box__pinicon">
                        <Icon type="pushpin" />
                    </Col> */}
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={8} className="storylist__image" align="right">
                    {<img src={avatarUrl} onClick={() => this.openStory(story.id, story.blog_category)} />}
                </Col>
            </Row>
        )
    }

    render() {
        return (
            <div className="storylist">
                {this.state.showLoader ? <Loader />
                    :
                    this.state.storyList
                }
            </div>
        )
    }
}

export default StoryListing;
