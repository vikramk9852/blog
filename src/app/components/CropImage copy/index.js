import React, { Component } from 'react';
import imageCompression from 'browser-image-compression';


class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleChange = (event) => {
        var imageFile = event.target.files[0];
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

        var options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        }
        imageCompression(imageFile, options)
            .then(function (compressedFile) {
                console.log('compressedFile instanceof Blob', compressedFile); // true
                console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

                // return uploadToServer(compressedFile); // write your own logic
            })
            .catch(function (error) {
                console.log(error.message);
            });
    }

    render() {
        return (
            <div>
                <input type="file" onChange={this.handleChange} />
                <img src={this.state.croppedImg} />
            </div>
        );
    }
}

export default Demo;