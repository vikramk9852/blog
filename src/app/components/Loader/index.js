import React, { Component } from 'react';
import './index.css';
import './index.scss';
import { Skeleton } from 'antd';


class Loader extends Component {

    render() {
        return (
            <div className="drawing" id="loading">
                <div className="loading-dot"></div>
            </div>
            // <Skeleton className="drawing" active paragraph={{ rows: 8 }} />

            // <div class="loader">
            //     <div class="dot"></div>
            //     <div class="dot"></div>
            //     <div class="dot"></div>
            // </div>
        )
    }
}

export default Loader;
