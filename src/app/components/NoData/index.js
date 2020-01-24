import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import './index.scss';
import "antd/dist/antd.css";

class NoData extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { title, noDataIcon, description } = this.props

        return (
            <div className="nodata">
                <img src={noDataIcon} alt="" /> <br /><br />
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        )
    }
}

export default withRouter(NoData);
