import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Menu, Dropdown, Icon, Input } from 'antd';
import './index.scss';
import "antd/dist/antd.css";

class CustomInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div  className="custom">
                <Input className="custom__input" onChange={(e)=>{this.props.setInput(e, this.props.purpose)}}/>
            </div>
        )
    }
}

export default withRouter(CustomInput);
