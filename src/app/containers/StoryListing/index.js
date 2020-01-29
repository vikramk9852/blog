import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Row, Col, Card, Icon, Typography, Affix } from 'antd';
import CustomMenu from '../../components/CustomDropDown';
import Loader from '../../components/Loader';
import NoData from '../../components/NoData';
import Firebase from '../../utils/firebase';
import { storyCategories } from '../../constants/app-constants';
import TempIcon from '../../../assets/images/travel.svg';
import Utils from '../../utils/utils';
import './index.scss';
import "antd/dist/antd.css";
import Meta from 'antd/lib/card/Meta';

const { Paragraph, Title } = Typography;
const menuItems = ['Lifestyle', 'Beauty', 'Travel', 'all'];
class StoryListing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: "0",
            showLoader: true,
            headerText: "All Stories"
        }
    }

    componentDidMount() {
        this.fetchAllStories();
    }

    fetchAllStories = (category) => {
        this.setState({ showLoader: true }, () => {
            category = category || storyCategories;
            let promiseArray = [];
            for (let index in category) {
                let promise = this.fetchStoryByCategory(category[index]).then(storyList => {
                    return {
                        category: category[index],
                        data: storyList
                    }
                })
                promiseArray.push(promise);
            }
            Promise.all(promiseArray).then(storyByCategory => {
                let allStories = [], filteredByCategory = {};
                for (let index in storyByCategory) {
                    allStories.push(storyByCategory[index].data);
                    filteredByCategory[storyByCategory[index].category] = storyByCategory[index].data;
                }
                this.props.hideLoader();
                this.setState({ storyList: allStories, allStories: allStories, filteredByCategory: filteredByCategory, showLoader: false });
            }).catch(() => {
                this.props.hideLoader();
                this.setState({ showLoader: false, switchTabLoader: false });
            })
        })
    }

    fetchStoryByCategory = (path) => {
        let firebase = Firebase.getInstance();
        return firebase.getDB().getDataBypath(`published/${path}`).then(stories => {
            stories = stories.val();
            let storyList = [], storyComponent, index = 0;
            for (let story in stories) {
                storyComponent = this.createStoryComponent(stories[story]);
                storyList.push(storyComponent);
            }
            return storyList;
        })
    }

    openStory(storyId) {
        let path = `story/${storyId}`;
        this.props.history.push(path);
    }

    createStoryComponent = (story) => {
        let avatarUrl = story.blog_avatar_url;
        let blogCategory = story.blog_category;
        let blogPublished = new Date(story.blog_publish_date);
        let publishedDate = blogPublished.getDate();
        let publishedMonth = blogPublished.getMonth();
        publishedMonth = Utils.getMonth(publishedMonth);
        let blogDescription = story.blog_description;
        const stats = 5;
        let titleLevel = 4;
        let titleEllipsis = 1;
        let titleToPath = Utils.replaceOccurences(story.blog_title, " ", "-");

        return (
            <Card
                className="storylist__row"
                cover={
                    <img
                        className="storylist__image"
                        alt="cover"
                        src={avatarUrl}
                        onClick={() => this.openStory(titleToPath)}
                    />
                }
            >
                <Meta
                    title={
                        <Title
                            style={{ cursor: "pointer" }}
                            level={titleLevel}
                            ellipsis={{ rows: titleEllipsis }}
                            onClick={() => this.openStory(titleToPath)}
                        >
                            {story.blog_title}
                        </Title>
                    }
                    description={
                        <div>
                            <Paragraph
                                style={{ cursor: "pointer", margin: 0 }}
                                ellipsis={{ rows: 2 }}
                                onClick={() => this.openStory(titleToPath)}
                            >
                                {blogDescription}
                            </Paragraph>
                            <p className="storylist__publishdate">
                                {`${publishedDate}  ${publishedMonth} · ${blogCategory} · ${parseInt(stats)} min read `}
                                <Icon type="star" theme="filled" />
                            </p>

                        </div>
                    }
                />
            </Card>
        )
    }

    filterStories = (e) => {
        let storyList = this.state.filteredByCategory[menuItems[e].toLowerCase()];
        // let headerTextArray = ["Lifestyle", "Beauty", "Travel"]
        let headerText = "All Stories"
        if (e == '3') {
            storyList = this.state.allStories;
        }
        else {
            headerText += ` (${menuItems[e]})`
        }
        this.setState({ storyList, headerText, selectedTab: menuItems[e] });
    }

    render() {
        return (
            <div className="storylist">
                {this.state.showLoader ? <Loader />
                    :
                    <div>
                        <Affix offsetTop={window.innerWidth > 767 ? 30 : 0}>
                            <Row gutter={24} className="storylist__header">
                                <Col span={20}>
                                    <h2 style={{ margin: 0 }}>{this.state.headerText}</h2>
                                </Col>
                                <Col span={3} align="right" style={{ padding: 0 }}>
                                    <CustomMenu
                                        handleClick={this.filterStories}
                                        menuItem={menuItems}
                                        defaultSelectedKeys={this.state.selectedTab}
                                        menuHolder="icon"
                                        iconType="filter"
                                        iconSize="13px"
                                    />
                                </Col>
                            </Row>
                        </Affix>
                        {this.state.storyList.length > 0 ? this.state.storyList : <NoData noDataIcon={TempIcon} title='No Stories' />}
                    </div>

                }
            </div>
        )
    }
}

export default withRouter(StoryListing);
