import React, { Component } from 'react';
import './index.css';
import './index.scss';
import { Skeleton } from 'antd';


class Loader extends Component {

    render() {
        return (
            <div>
                {
                    this.props.dotLoader ?
                        <div className="drawing" id="loading">
                            <div className="loading-dot"></div>
                        </div>
                        :
                        <Skeleton className="drawing" active paragraph={{ rows: 8 }} />
                }
            </div>

            // <div class="loader">
            //     <div class="dot"></div>
            //     <div class="dot"></div>
            //     <div class="dot"></div>
            // </div>
        )
    }
}

export default Loader;
