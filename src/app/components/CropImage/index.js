import React, { PureComponent } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import Loader from '../Loader';
import imageCompression from 'browser-image-compression';
import { Modal, Spin } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './index.scss';

class CropImage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            src: null,
            cropImageModal: false,
            crop: {},
        };
    }

    onSelectFile = (e, cropDimension) => {
        if (e.target.files && e.target.files.length > 0) {
            let imageFile = e.target.files[0];
            console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
            console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

            let options = {
                maxSizeMB: 1.5,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            }
            let that = this;
            this.setState({ cropImageModal: true, showLoader: true }, () => {
                imageCompression(imageFile, options)
                    .then(function (compressedFile) {
                        console.log('compressedFile instanceof Blob', compressedFile); // true
                        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
                        that.setState({
                            crop: cropDimension && cropDimension.aspect,
                            src: URL.createObjectURL(compressedFile),
                            showLoader: false
                        })
                        // return uploadToServer(compressedFile); // write your own logic
                    })
                    .catch(function (error) {
                        console.log(error.message);
                    });
            });
        }
    };

    handleOk = () => {
        let data = this.refs.cropper.getCroppedCanvas();
        let that = this;
        this.setState({ showLoader: true }, () => {
            data.toBlob(function (blob) {
                let newImg = document.createElement('img'),
                    url = URL.createObjectURL(blob);

                newImg.onload = function () {
                    // no longer need to read the blob so it's revoked
                    URL.revokeObjectURL(url);
                };

                console.log(blob)
                // that.setState({ croppedImg: url })
                that.setState({ cropImageModal: false, showLoader: false });
                that.props.setFileInfo(blob, url);
            });
        })
    }

    render() {
        const { crop, src } = this.state;
        return (
            <div className="cropimage">
                <Modal
                    title="Crop the image"
                    maskClosable={false}
                    visible={this.state.cropImageModal}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ cropImageModal: false })}
                >
                    <div style={{ height: this.state.showLoader && '300px' }}>
                        {this.state.showLoader ?
                            <Spin className="drawing" size="large" /> :
                            <Cropper
                                ref={"cropper"}
                                src={src}
                                style={{ height: 400 }}
                                // Cropper.js options
                                aspectRatio={crop}
                                guides={true}
                                highlight={true}
                                zoomable={false}
                            />
                        }
                    </div>
                </Modal>
            </div>
        );
    }
}

export default CropImage;
