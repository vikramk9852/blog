import React, { Component } from 'react';
import './index.css';
import './index.scss';


class Loader extends Component {

    render() {
        return (
            <div className="drawing" id="loading">
                <div className="loading-dot"></div>
            </div>
        )
    }
}

export default Loader;
