import React, { Component } from 'react';
import { Row, Col, Menu, message, Modal, Button, Tag } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../../components/Loader';
import CustomMenu from '../../components/CustomDropDown';
import Firebase from '../../utils/firebase';
import { storyCategories } from '../../constants/app-constants';
import './index.scss';
import "antd/dist/antd.css";
import Utils from '../../utils/utils';
const menuItems = ['Lifestyle', 'Beauty', 'Travel', 'All'];

class Stories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: "0",
            showLoader: true,
            switchTabLoader: false,
            allStories: [],
            currentTab: "published"
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = (category) => {
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
            this.setState({ storyList: allStories, allStories: allStories, filteredByCategory: filteredByCategory, showLoader: false, switchTabLoader: false });
        }).catch(() => {
            this.setState({ showLoader: false, switchTabLoader: false });
        })
    }

    openStory = (path) => {
        path = Utils.replaceOccurences(path, ' ', '-');
        this.props.history.push(`story/${path}`);
    }

    fetchStoryByCategory = (path) => {
        let firebase = Firebase.getInstance();
        return firebase.getDB().getDataBypath(`${this.state.currentTab}/${path}`).then(stories => {
            stories = stories.val();
            let storyList = [], storyComponent, index = 0;
            for (let story in stories) {
                storyComponent = this.createStoryComponent(stories[story]);
                storyList.push(storyComponent);
            }
            return storyList;
        })
    }

    createStoryComponent = (story) => {
        let text = "Story", archive = "Archive";
        if (this.state.currentTab === "drafts") {
            text = "Draft";
            archive = "Publish";
        }

        let temp = document.createElement("div");
        temp.innerHTML = story.blog_data;
        let sanitized = temp.textContent || temp.innerText;
        return (
            <div className="stories__contents__story" key={story.blog_title}>
                <p className="stories__contents__story__title" onClick={() => { this.openStory(story.blog_title) }}><span className="ql-size-large">{story.blog_title}</span></p>
                <p className="stories__contents__story__description" onClick={() => { this.openStory(story.blog_title) }}>{story.blog_description || ReactHtmlParser(sanitized)}</p>
                <p><span style={{ marginRight: "10px" }}>Published on: {Utils.getDateString(story.blog_publish_date)}</span>
                    <Tag>{story.blog_category}</Tag>
                    <span onClick={() => {
                        this.setState({ blogData: story })
                    }}>
                        <CustomMenu
                            handleClick={this.handleClick}
                            menuItem={[`Edit ${text}`, `Delete ${text}`, `${archive} ${text}`]}
                            menuHolder="icon"
                            iconType="down"
                            iconSize="13px"
                        />
                    </span>
                </p>
            </div>
        )
    }

    updateState = (postData) => {

        let publishedStories = this.state.publishedStories;
        let draftStories = this.state.draftStories;
        if (postData.blog_state === "draft") {
            for (let i = 0; i < publishedStories.length; i++) {
                if (publishedStories[i].key === postData.id) {
                    draftStories.push(publishedStories[i]);
                    publishedStories.splice(i, 1);
                    break;
                }
            }
        }
        else {
            for (let i = 0; i < draftStories.length; i++) {
                if (draftStories[i].key === postData.id) {
                    publishedStories.push(draftStories[i]);
                    draftStories.splice(i, 1);
                    break;
                }
            }
        }
        this.setState({ publishedStories: publishedStories, draftStories: draftStories });
    }

    deleteBlog = () => {
        this.setState({ switchTabLoader: true }, () => {
            let storyId = this.state.blogData.blog_title;
            storyId = Utils.replaceOccurences(storyId, ' ', '-');
            let category = this.state.blogData.blog_category;
            let path = `${this.state.currentTab}/${category}/${storyId}`;
            let firebase = Firebase.getInstance();
            firebase.getDB().deleteBypath(path).then(res => {
                message.success("Successfully deleted the story");
                this.fetchData();
                this.setState({ switchTabLoader: false, showDeleteDialogue: false });
            }).catch(err => {
                message.err("Error in deleting the story");
                this.setState({ switchTabLoader: false, showDeleteDialogue: false });
            })
        })
    }

    handleClick = (value) => {
        let blogCategory = this.state.blogData.blog_category;
        let storyId = this.state.blogData.blog_title;
        storyId = Utils.replaceOccurences(storyId, ' ', '-');
        switch (value) {
            case "0":
                this.props.history.push(`/editor/update/${storyId}`)
            case "1":
                this.setState({ showDeleteDialogue: true })
                break;
            case "2":
                this.setState({ switchTabLoader: true }, () => {
                    let newPath = `drafts/${blogCategory}/${storyId}`;
                    let oldPath = `published/${blogCategory}/${storyId}`;
                    if (this.state.currentTab === "drafts") {
                        [oldPath, newPath] = [newPath, oldPath];
                    }

                    let firebase = Firebase.getInstance();
                    let firebaseDB = firebase.getDB();
                    let metaDataPath = `blogdata/${storyId}/blog_metadata`;
                    return firebaseDB.moveData(oldPath, newPath).then(res => {
                        return firebaseDB.updateBypath(metaDataPath, { blog_metadata: newPath });
                    }).then(res => {
                        this.fetchData();
                        message.success("Story Archieved successfully");
                        this.setState({ switchTabLoader: false });
                    }).catch(err => {
                        console.error("Error in archiving the story", err);
                        message.error("Error in archiving the story");
                        this.setState({ switchTabLoader: false });
                    })
                })
                break;
        }
    }

    switchTab = (e) => {
        this.setState({ currentTab: e.key, switchTabLoader: true }, () => {
            this.fetchData();
        });
    }

    filterStories = (e) => {
        console.log(e);
        let storyList = this.state.filteredByCategory[menuItems[e].toLowerCase()];
        // let headerTextArray = ["Lifestyle", "Beauty", "Travel"]
        let headerText = "All Stories"
        if (e == '3') {
            storyList = this.state.allStories;
        }
        else {
            headerText += ` (${menuItems[e]})`
        }
        this.setState({ storyList, headerText });
    }

    render() {
        return (
            <div className="stories">
                {this.state.showLoader ? <Loader />
                    :
                    <div className="stories__contents">
                        {/* <Affix offsetTop={0}> */}

                        <Row className="stories__heading">
                            <Col span={12}>
                                <span className="ql-size-huge">Your Stories</span>
                            </Col>
                            <Col span={12} align="right">
                                <Button type="primary" onClick={() => { this.props.history.push('/editor?new') }}>New Story</Button>
                            </Col>
                        </Row>
                        <Menu
                            onClick={this.switchTab}
                            selectedKeys={[this.state.currentTab]}
                            mode="horizontal"
                            disabled={this.state.switchTabLoader}
                        >
                            <Menu.Item key="published">
                                Published
                            </Menu.Item>
                            <Menu.Item key="drafts">
                                Drafts
                            </Menu.Item>
                            <Menu.Item key="filter" disabled={true}>
                                <CustomMenu
                                    handleClick={this.filterStories}
                                    menuItem={menuItems}
                                    menuHolder="icon"
                                    iconType="filter"
                                    iconSize="13px"
                                />
                            </Menu.Item>
                        </Menu>
                        <div className="stories__allstories">
                            {this.state.switchTabLoader ?
                                <Loader />
                                :
                                this.state.storyList
                            }
                        </div>
                    </div>
                }
                <Modal
                    visible={this.state.showDeleteDialogue}
                    footer={false}
                    onCancel={() => { this.setState({ showDeleteDialogue: false }) }}
                >
                    <div align="center">
                        <b><p className="ql-size-huge" style={{ marginBottom: "0" }}>Delete</p></b>
                        <p style={{ paddingTop: "8px", paddingBottom: "24px", marginBottom: "0" }}>Deleted stories are gone forever. Are you sure?</p>
                        <Button type="primary" onClick={this.deleteBlog}>Delete</Button>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <Button onClick={() => { this.setState({ showDeleteDialogue: false }) }}>Cancel</Button>
                    </div>
                </Modal>
            </div >
        )
    }
}

export default Stories;
