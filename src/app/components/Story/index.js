import React, { Component } from 'react';
import { Typography, message, Avatar, Icon } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../Loader';
import Utils from '../../utils/utils';
import Firebase from '../../utils/firebase';
import './index.scss';
import "antd/dist/antd.css";
const { Paragraph } = Typography

class Story extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: "0",
            showLoader: true
        }
    }

    componentDidMount() {
        let path = this.props.location.pathname;
        path = path.split('story/')[1];
        let firebase = Firebase.getInstance();
        if (this.storyState === "drafts") {
            let user = firebase.getAuth().getCurrentUser();
            if (!user) {
                message.error("You must be logged in to view this story");
                return;
            }
        }
        this.fetchStory(firebase, path);
    }

    fetchStory(firebase, path) {
        let storyData, profile;
        firebase.getDB().getDataBypath(`blogdata/${path}`).then(storyData => {
            if (!storyData) {
                message.error("Story not found");
                this.setState({
                    showLoader: false
                })
                return;
            }
            let profile = firebase.getDB().getDataBypath('profile');
            return Promise.all([storyData, profile]);
        }).then(res => {
            debugger;

            storyData = res[0].val();
            profile = res[1].val();
            let metaDataPath = storyData.blog_metadata.blog_metadata;
            return firebase.getDB().getDataBypath(metaDataPath);
        }).then(res => {
            let blogData = storyData.blog_data;
            let storyMetaData = res.val();
            console.log(blogData, storyMetaData);
            this.setState({
                title: storyMetaData.blog_title,
                content: blogData,
                avatarUrl: storyMetaData.blog_avatar_url,
                description: storyMetaData.blog_description,
                publishDate: storyMetaData.blog_publish_date,
                category: storyMetaData.blog_category,
                imgUrl: profile.profile_image,
                name: profile.profile_name,
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
        let blogPublished = new Date(this.state.publishDate);
        let blogCategory = this.state.category;
        let publishedDate = blogPublished.getDate();
        let publishedMonth = blogPublished.getMonth();
        publishedMonth = Utils.getMonth(publishedMonth);
        const stats = 5;

        return (
            <div className="story">
                {this.state.showLoader ? <Loader />
                    :
                    <div>
                        <div className="story__cover">
                            <p className="ql-size-title story__title">{this.state.title}</p>

                            <Paragraph
                                style={{ margin: 0 }}
                                ellipsis={{ rows: 2 }}
                                className="story__description"
                            >
                                {this.state.description}
                            </Paragraph>
                            <div className="story__author">
                                <Avatar size={50} className="story__author__avatar" src={this.state.imgUrl} />
                                <div style={{ transform: 'translate(0, 7%)' }}>
                                    <p className="story__author__name">{this.state.name}</p>
                                    <p className="story__publishdate">
                                        {`${publishedDate}  ${publishedMonth} · ${blogCategory} · ${parseInt(stats)} min read `}
                                        <Icon type="star" theme="filled" />
                                    </p>
                                </div>
                            </div>
                            <div className="story__cover__image">
                                <img align="center" src={this.state.avatarUrl} alt="cover_image" />
                            </div>
                        </div>
                        <div className="story__content">
                            {ReactHtmlParser(this.state.content)}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Story;
