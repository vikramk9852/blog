import React, { Component } from 'react';
import { Input, Icon, Row, Col, Button, message } from 'antd';
import Loader from '../../components/Loader';
import Firebase from '../../utils/firebase';
import CropImage from '../../components/CropImage';
import './index.scss';
import "antd/dist/antd.css";
import Utils from '../../utils/utils';
const { TextArea } = Input;

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoader: true,
            mouseEnter: false,
            profileEmail: "",
            profileDescription: "",
            profileName: "",
            profileImageUrl: "",
        }
    }

    componentDidMount() {
        let firebase = Firebase.getInstance();
        firebase.getDB().getDataBypath('profile').then(res => {
            res = res.val();
            this.setState({
                profileEmail: res.profile_email,
                profileDescription: res.profile_description,
                profileName: res.profile_name,
                profileImageUrl: res.profile_image,
                showLoader: false
            })

            //testing
            this.generateBlobFile(res.profile_image);
        }).catch(err => {
            this.setState({
                showLoader: false
            })
            message.error("Error in fetching profile details");
            console.log(err);
        })
    }

    generateBlobFile = (imgUrl) => {
        Utils.urlToBlobImage(imgUrl).then(res => {
            this.setState({ profileImageBlob: res, showLoader: false });
        }).catch(err => {
            console.log(err);
            this.setState({ showLoader: false });
        })
    }


    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    updateProfile = () => {
        let profileData = {
            profile_email: this.state.profileEmail,
            profile_description: this.state.profileDescription,
            profile_name: this.state.profileName
        }
        let firebase = Firebase.getInstance();
        let firebaseApp = firebase.getFirebaseApp();
        this.setState({ showLoader: true }, () => {
            let uploadTask = firebase.getStorage().uploadBlobImage(this.state.profileImageBlob);
            uploadTask.on(firebaseApp.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function (snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebaseApp.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebaseApp.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    message.error("Some error occured");
                    this.setState({ showLoader: false });
                    console.log(error);
                })
            return uploadTask.then(uploadPromise => {
                return uploadPromise.ref.getDownloadURL()
            }).then(profileImageUrl => {
                let path = 'profile';
                profileData.profile_image = profileImageUrl;
                return firebase.getDB().put(path, profileData)
            }).then(res => {
                message.success("Profile updated successfully");
                this.setState({ showLoader: false });
            }).catch(err => {
                console.log(err);
                message.error("Error in updating profile");
                this.setState({ showLoader: false });
            })
        })
    }

    setProfileImgInfo(profileImageBlob, profileImageUrl) {
        this.setState({ profileImageBlob: profileImageBlob, profileImageUrl: profileImageUrl });
    }

    cropImage = (e) => {
        const cropDimension = {
            unit: '%',
            width: 30,
            aspect: 20 / 20
        }
        this.refs.cropImage.onSelectFile(e, cropDimension);
    }
    render() {
        return (
            <div className="profile">
                {this.state.showLoader ? <Loader />
                    :
                    <div>
                        <div className="profile__profile_photo">

                            <label for="upload__profile__photo">
                                {this.state.mouseEnter && <Icon className="profile__profile_photo__upload__icon" type="upload" />}
                                <img
                                    onMouseEnter={() => { this.setState({ mouseEnter: true }) }}
                                    onMouseLeave={() => { this.setState({ mouseEnter: false }) }}
                                    className="profile__profile_photo__image"
                                    align="center"
                                    height="200px"
                                    width="200px"
                                    src={this.state.profileImageUrl}
                                />
                            </label>
                            <input type="file" onChange={this.cropImage} id="upload__profile__photo" />

                        </div>
                        <div className="cropimage__component">
                            <CropImage ref="cropImage" setFileInfo={(profileImageBlob, profileImageUrl) => this.setProfileImgInfo(profileImageBlob, profileImageUrl)} />
                        </div>
                        <p className="ql-size-large">Profile Details</p>
                        <div className="profile__input">
                            <p className="profile__input__tag">Publishing name</p>
                            <Input style={{ height: "50px" }} value={this.state.profileName} onChange={(e) => { this.setState({ profileName: e.target.value }) }} />
                            <div style={{ margin: "20px 0" }}>
                                <p className="profile__input__tag">Tell something about yourself</p>
                                <TextArea
                                    value={this.state.profileDescription}
                                    onChange={(e) => { this.setState({ profileDescription: e.target.value }) }}
                                    autosize={{ minRows: 3, maxRows: 5 }}
                                />
                            </div>
                            <p className="profile__input__tag">Your Email</p>
                            <Input style={{ height: "50px" }} value={this.state.profileEmail} onChange={(e) => { this.setState({ profileEmail: e.target.value }) }} />
                            <Button type="primary" className="profile__update_button" onClick={this.updateProfile}>Update</Button>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Profile;
