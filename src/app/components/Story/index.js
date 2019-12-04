import React, { Component } from 'react';
import { Icon, message } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../Loader';
import Firebase from '../../utils/firebase';
import './index.scss';
import "antd/dist/antd.css";

class Story extends Component {

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
        let storyState = urlInfo[1];
        let storyTag = urlInfo[2];
        let storyId = urlInfo[3];
        let path = `${storyState}/${storyTag}/${storyId}`;
        let firebase = Firebase.getInstance();
        if (this.storyState === "drafts") {
            let user = firebase.getAuth().getCurrentUser();
            if (!user) {
                message.error("You must be logged in to view this story");
                return;
            }
        }
        this.fetchStory(firebase, path, storyId);
    }

    fetchStory(firebase, path, storyId) {
        firebase.getDB().getDataBypath(path).then(res => {
            let storyData = res.val();
            if (!storyData) {
                message.error("Story not found");
                this.setState({
                    showLoader: false
                })
                return;
            }
            this.setState({
                title: storyData.blog_title,
                content: storyData.blog_data,
                avatarUrl: storyData.blog_avatar_url,
                storyId: storyId,
                showLoader: false
            })
        }).catch(err => {
            console.log(err);
            message.error("Error in fetching story");
            this.setState({
                showLoader: false
            })
        })
    }

    render() {
        return (
            <div className="story">
                {this.state.showLoader ? <Loader />
                    :
                    <div>
                        <p className="ql-size-title story__title" align="center">{this.state.title}</p>
                        <img className="story__avatar" align="center" src={this.state.avatarUrl} />
                        <div className="story__content">{ReactHtmlParser(this.state.content)}</div>
                    </div>
                }
            </div>
        )
    }
}

export default Story;
