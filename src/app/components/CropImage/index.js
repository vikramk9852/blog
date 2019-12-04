import ReactDOM from 'react-dom';
import React, { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Firebase from '../../utils/firebase';
import { Button, Modal } from 'antd';
import './index.scss';

class CropImage extends PureComponent {
    state = {
        src: null,
        cropImageModal: false,
        crop: {},
    };

    onSelectFile = (e, cropDimension) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
            this.setState({
                cropImageModal: true,
                crop: cropDimension
            })
        }
    };

    // If you setState the crop in here you should return false.
    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            this.setState({ croppedImageUrl });
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = fileName;
                this.setState({ blobImage: blob });
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, 'image/jpeg');
        });
    }

    handleOk = () => {
        this.setState({ cropImageModal: false });
        this.props.setFileInfo(this.state.blobImage, this.state.croppedImageUrl)
    }

    render() {
        const { crop, src } = this.state;
        return (
            <div className="cropimage">
                {src && (
                    <Modal
                        title="Crop the image"
                        maskClosable={false}
                        visible={this.state.cropImageModal}
                        onOk={this.handleOk}
                        onCancel={() => this.setState({ cropImageModal: false })}
                    >
                        <div>
                            <ReactCrop
                                src={src}
                                crop={crop}
                                ruleOfThirds
                                onImageLoaded={this.onImageLoaded}
                                onComplete={this.onCropComplete}
                                onChange={this.onCropChange}
                                keepSelection={true}
                            />
                        </div>
                    </Modal>
                )}
            </div>
        );
    }
}

export default CropImage;
