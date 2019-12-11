import React, { Component } from 'react';
import { Row, Col, Menu, message, Modal, Button, Icon } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../../components/Loader';
import CustomMenu from '../../components/CustomDropDown';
import Firebase from '../../utils/firebase';
import './index.scss';
import "antd/dist/antd.css";
import Utils from '../../utils/utils';

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

    fetchData = () => {
        let firebase = Firebase.getInstance();
        let path = this.state.currentTab;
        firebase.getDB().getDataBypath(path).then(stories => {
            stories = stories.val();
            let allStories = [];
            for (let category in stories) {
                for (let story in stories[category]) {
                    allStories.push(this.createStoryComponent(stories[category][story]));
                }
            }
            allStories = <div className="stories__allstories">{allStories}</div>;
            this.setState({ allStories: allStories, showLoader: false, switchTabLoader: false });
        }).catch(() => {
            this.setState({ showLoader: false, switchTabLoader: false });
        })
    }

    createStoryComponent = (story) => {
        let text = "Story", archive = "Archive";
        if (story.blog_state === "draft") {
            text = "Draft";
            archive = "Publish";
        }

        let temp = document.createElement("div");
        temp.innerHTML = story.blog_data;
        let sanitized = temp.textContent || temp.innerText;
        return (
            <div className="stories__contents__story" key={story.id}>
                <p className="stories__contents__story__title" onClick={() => { this.props.history.push(`/story?${this.state.currentTab}?${story.blog_category}?${story.id}`) }}><span className="ql-size-large">{story.blog_title}</span></p>
                <p className="stories__contents__story__description" onClick={() => { this.props.history.push(`/story?${this.state.currentTab}?${story.blog_category}?${story.id}`) }}>{story.blog_description || ReactHtmlParser(sanitized)}</p>
                <p><span style={{ marginRight: "10px" }}>Published on: {Utils.getDateString(story.blog_publish_date)}</span>
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
            let storyId = this.state.blogData.id;
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
        switch (value) {
            case "0":
                this.props.history.push(`/editor?update?${this.state.currentTab}?${blogCategory}?${this.state.blogData.id}`)
            case "1":
                this.setState({ showDeleteDialogue: true })
                break;
            case "2":
                this.setState({ switchTabLoader: true }, () => {
                    let storyId = this.state.blogData.id;
                    let newPath = `drafts/${blogCategory}/${storyId}`, oldPath = `published/${blogCategory}/${storyId}`;
                    if (this.state.currentTab === "drafts") {
                        [oldPath, newPath] = [newPath, oldPath];
                    }

                    let firebase = Firebase.getInstance();
                    firebase.getDB().moveData(oldPath, newPath).then(res => {
                        this.fetchData();
                        message.success("Story Archieved successfully");
                        this.setState({ switchTabLoader: false });
                    }).catch(err => {
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
                                    menuItem={['lifestyle', 'beauty', 'travel']}
                                    menuHolder="icon"
                                    iconType="filter"
                                    iconSize="13px"
                                />
                            </Menu.Item>
                        </Menu>
                        {/* </Affix> */}
                        {this.state.switchTabLoader ?
                            <Loader />
                            :
                            this.state.allStories
                        }
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
