import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Utils from '../../utils/utils';
import './index.scss';
import { Input, Button, Select, Row, Col, message } from 'antd';
import Loader from '../Loader';
import CropImage from '../../components/CropImage';
import Firebase from '../../utils/firebase';
const QuillImage = Quill.import('formats/image');


const { Option } = Select;
const { TextArea } = Input;
const initialString = "<p><br></p>";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.quillRef = null;
    this.reactQuillRef = null;
    this.modules = {
      toolbar: {
        container: [
          [{ 'font': [] }, { size: [] }],
          ['bold', 'italic', 'underline', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' },
          { 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
          [{ 'color': [] }, { 'background': [] }],
          ['link', 'image'],
          ['clean']],
        handlers: {
          'image': this.imageHandler
        }
      }
    }
    this.formats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'color', 'background', 'align',
      'link', 'image', 'video'
    ]

    this.state = {
      editorHtml: initialString,
      theme: 'snow',
      selectedTag: 'lifestyle',
      showLoader: true,
      title: "",
      toUpdate: false,
      avatarUrl: "",
      croppedImageUrl: "",
      croppedImageFile: "",
      description: "",
      blobUrlToFile: {},
      publishDate: new Date().toDateString()
    }
  }

  componentDidMount() {
    let url = this.props.location.search;
    let info = url.split('?');
    let blogState = info[2];
    let blogCategory = info[3];
    let storyId = info[4];
    if (info[1] === "update") {
      let firebase = Firebase.getInstance();
      let path = `${blogState}/${blogCategory}/${storyId}`
      firebase.getDB().getDataBypath(path).then(res => {
        let story = res.val();
        this.setState({
          editorHtml: story.blog_data,
          selectedTag: story.blog_category,
          title: story.blog_title,
          publishDate: story.blog_publish_date,
          description: story.blog_description,
          storyId: storyId,
          avatarUrl: story.blog_avatar_url,
          toUpdate: true,
          blogState: blogState,
          showLoader: false
        });
        this.attachQuillRefs();
        this.generateBlobFile(story.blog_avatar_url);
      }).catch(err => {
        console.log(err);
        this.setState({ showLoader: false });
      })
    }
    else {
      this.setState({ showLoader: false });
    }
  }

  componentDidUpdate() {
    this.attachQuillRefs();
  }

  attachQuillRefs = () => {
    if (!this.reactQuillRef || typeof this.reactQuillRef.getEditor !== 'function') return;
    if (this.quillRef != null) return;

    const quillRef = this.reactQuillRef.getEditor();
    if (quillRef != null) this.quillRef = quillRef;
  }

  generateBlobFile = (imgUrl) => {
    Utils.urlToBlobImage(imgUrl).then(res => {
      this.setState({ croppedImageFile: res, showLoader: false });
    }).catch(err => {
      console.log(err);
      this.setState({ showLoader: false });
    })
  }

  extractImgSrc = () => {
    let temp = document.createElement('div');
    temp.innerHTML = this.state.editorHtml;
    let imgArray = temp.getElementsByTagName('img');
    let res = [], imgSrc;
    for (let index = 0; index < imgArray.length; index++) {
      imgSrc = imgArray[index].src;
      if (imgSrc && imgSrc.startsWith('blob:http'))
        res.push(imgArray[index].src);
    }
    return res;
  }

  handleEditorTextChange = (html) => {
    this.setState({ editorHtml: html });
  }

  handleTagChange = (value) => {
    this.setState({ selectedTag: value });
  }

  uploadImagesToBucket = () => {
    let images = this.extractImgSrc();
    let promiseArray = [];
    let firebase = Firebase.getInstance();
    let firebaseApp = firebase.getFirebaseApp();
    for (let index in images) {
      let blobImage = this.state.blobUrlToFile[images[index]];
      let uploadTask = firebase.getStorage().uploadBlobImage(blobImage);
      promiseArray.push(uploadTask);
      promiseArray.push(images[index]);
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
          console.log(error);
        })
    }
    return Promise.all(promiseArray);
  }

  setAvatarFile(croppedImageFile, croppedImageUrl) {
    this.setState({ croppedImageFile: croppedImageFile, croppedImageUrl: croppedImageUrl }, () => {
      if (this.state.editorImageCropping) {
        this.setState({ editorImageCropping: false })
        this.pushImageToEditor();
      }
      else {
        this.setState({ avatarUrl: croppedImageUrl, avatarFile: croppedImageFile });
      }
    });
  }

  uploadAvatarToBucket = (blob) => {
    let firebase = Firebase.getInstance();
    return firebase.getStorage().uploadBlobImage(blob);
  }

  handleSubmit = (action) => {
    let editorText = this.state.editorHtml;
    if (!this.state.avatarUrl) {
      message.error("Please upload avatar file for this story");
      return;
    }
    this.setState({ showLoader: true }, () => {
      this.uploadAvatarToBucket(this.state.croppedImageFile).then(avatarPromise => {
        avatarPromise.ref.getDownloadURL().then(croppedImageUrl => {
          console.log(croppedImageUrl);
          this.setState({ croppedImageUrl: croppedImageUrl })
          return this.uploadImagesToBucket();
        }).then(res => {
          debugger;
          let length = res.length;
          let promiseArray = [];
          for (let index = 0; index < length; index += 2) {
            promiseArray.push(res[index].ref.getDownloadURL());
            promiseArray.push(res[index + 1]);
          }
          return Promise.all(promiseArray);
        }).then(res => {
          let length = res.length;
          for (let index = 0; index < length; index += 2) {
            editorText = editorText.replace(res[index + 1], res[index]);
          }
          console.log(editorText);
          this.publishBlog(action, editorText);
        }).catch(err => {
          message.error("Some error occured");
          this.setState({ showLoader: false });
          console.log(err);
        })
      })
    })
  }

  publishBlog = (action, htmlString) => {
    let firebase = Firebase.getInstance();
    let user = firebase.getAuth().getCurrentUser();
    let storyPathTag = this.state.selectedTag.toLowerCase();
    if (user) {
      debugger;
      let path = `${action}/${storyPathTag}`;
      let postData = {
        blog_title: this.state.title,
        blog_category: this.state.selectedTag,
        blog_data: htmlString,
        blog_publish_date: this.state.publishDate,
        blog_description: this.state.description,
        blog_avatar_url: this.state.croppedImageUrl
      }
      if (this.state.toUpdate) {
        let oldPath = `${this.state.blogState}/${storyPathTag}/${this.state.storyId}`;
        if (action === this.state.blogState) {
          firebase.getDB().updateBypath(oldPath, postData).then(() => {
            message.success("Blog updated successfully");
            this.setState({ showLoader: false });
            this.props.history.goBack();
          }).catch(err => {
            console.log(err);
            message.error("Error in updating blog");
            this.setState({ showLoader: false });
          })
        }
        else {
          let newPath = this.state.blogState === "drafts" ? `published/${storyPathTag}/${this.state.storyId}` : `drafts/${storyPathTag}/${this.state.storyId}`;

          firebase.getDB().updateBypath(oldPath, postData).then(() => {
            firebase.getDB().moveData(oldPath, newPath).then(() => {
              message.success("Blog updated successfully");
              this.setState({ showLoader: false });
              this.props.history.goBack();
            }).catch(err => {
              console.log(err);
              message.error("Error in updating blog")
              this.setState({ showLoader: false });
            })
          }).catch(err => {
            console.log(err);
            message.error("Error in updating blog")
            this.setState({ showLoader: false });
          })
        }
      }
      else {
        firebase.getDB().push(path, postData).then(() => {
          message.success("Blog posted successfully");
          this.setState({ showLoader: false });
          this.props.history.goBack();
        }).catch(err => {
          console.log(err);
          message.error("Error in creating blog");
          this.setState({ showLoader: false });
        })
      }
    }
    else {
      message.error("Session timed out, please login again");
      this.setState({ showLoader: false });
    }
  }

  imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('id', 'editorImageInput');
    input.setAttribute('accept', 'image/*');
    const cropDimension = {
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    }
    input.addEventListener('change', (e) => {
      this.setState({ editorImageCropping: true }, () => {
        this.refs.cropImage.onSelectFile(e, cropDimension);
      })
    })
    input.click();
  }

  pushImageToEditor() {
    const range = this.quillRef.getSelection();
    const index = range.index + range.length;
    let imgUrl = this.state.croppedImageUrl;
    QuillImage.sanitize = function (imgUrl) {
      return imgUrl;
    };
    this.setState({ blobUrlToFile: { ...this.state.blobUrlToFile, [imgUrl]: this.state.croppedImageFile } })
    this.quillRef.insertEmbed(index, 'image', imgUrl, Quill.sources.USER);
  }

  render() {
    const cropDimension = {
      aspect: 2 / 1
    }
    return (
      <div>
        {
          this.state.showLoader ? <Loader dotLoader={true} /> :
            <div className="editor" >
              < Row className="editor__container" >
                <Col className="editor__leftpane" span={24} style={{ padding: "0 10px" }}>
                  <div className="editor__title">
                    <Input value={this.state.title} placeholder="Title of story" onChange={(e) => { this.setState({ title: e.target.value }) }} />
                  </div>
                  <ReactQuill
                    theme={this.state.theme}
                    onChange={this.handleEditorTextChange}
                    modules={this.modules}
                    formats={this.formats}
                    bounds={'.editor'}
                    placeholder="Start writing something"
                    defaultValue={this.state.editorHtml}
                    ref={(el) => this.reactQuillRef = el} />
                  <div>
                    <Select className="editor__select__tag" defaultValue={this.state.selectedTag} placeholder="Select Tag for this story" style={{ width: 200 }} onChange={this.handleTagChange}>
                      <Option value="lifestyle">LifeStyle</Option>
                      <Option value="beauty">Beauty</Option>
                      <Option value="travel">Travel</Option>
                    </Select>
                    <TextArea placeholder="Enter one line description of your story" value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} />
                  </div>
                  <div className="editor__avatar">
                    <p>Cover for your story</p>
                    {(this.state.avatarUrl || this.state.avatarUrl) && <img id="avatarFile" src={this.state.avatarUrl} style={{ width: "300px", height: "150px", marginBottom: "1em" }} alt="avatar" />}
                    <input type="file" accept="image/*" id="avatarImageInput" onChange={(e) => this.refs.cropImage.onSelectFile(e, cropDimension)} />
                    <CropImage ref="cropImage" setFileInfo={(croppedImageFile, croppedImageUrl) => this.setAvatarFile(croppedImageFile, croppedImageUrl)} />
                  </div>
                  <br />
                  <Button
                    className="editor__button"
                    style={{ marginRight: "20px" }}
                    onClick={() => { this.handleSubmit("drafts") }}
                  >Draft</Button>

                  <Button
                    className="editor__button"
                    onClick={() => { this.handleSubmit("published") }}
                    type="primary"
                  >Publish</Button>
                </Col>
              </Row >
            </div >
        }
      </div >
    )
  }
}

export default Editor;