import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // see installation section above for versions of NPM older than 3.0.0
import TestImg from '../../../assets/images/background.jpg';
// If you choose not to use import, you need to assign Cropper to default
// var Cropper = require('react-cropper').default

const cropper = React.createRef(null);

class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    _crop = () => {
        // image in dataUrl
        let data = this.refs.cropper.getCroppedCanvas();
        let that = this;
        data.toBlob(function (blob) {
            var newImg = document.createElement('img'),
                url = URL.createObjectURL(blob);

            newImg.onload = function () {
                // no longer need to read the blob so it's revoked
                URL.revokeObjectURL(url);
            };

            newImg.src = url;
            console.log(blob)
            that.setState({ croppedImg: url })
        });
    }

    render() {
        return (
            <div>
                <Cropper
                    ref={"cropper"}
                    src={TestImg}
                    style={{ height: 400, width: 400 }}
                    // Cropper.js options
                    aspectRatio={16 / 9}
                    guides={true}
                />
                <button onClick={this._crop}>test</button>
                <img src={this.state.croppedImg} />
            </div>
        );
    }
}

export default Demo;