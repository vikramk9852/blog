import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Menu, Dropdown, Icon } from 'antd';
import './index.scss';
import "antd/dist/antd.css";

class LeftMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: 0
        }
    }

    handleClick = (e) => {
        this.props.handleClick(e.key);
    }

    renderMenuItems = () => {
        let menuItem = this.props.menuItem;
        let menuArray = [];
        for (let i = 0; i < menuItem.length; i++) {
            menuArray.push(
                <Menu.Item key={i}>{menuItem[i]}</Menu.Item>
            )
        }
        return menuArray;
    }

    renderMenuHolder = () => {
        if (this.props.menuHolder === "icon")
            return <Icon type={this.props.iconType} style={{ fontSize: this.props.iconSize }} />
        return <Icon type="user" />
    }

    render() {
        console.log(this.props.menuHolder)
        return (
            <div style={{ display: "inline" }}>
                <Dropdown
                    overlay={
                        <Menu onClick={this.handleClick} defaultSelectedKeys={[this.props.defaultSelectedKeys]} style={{ minWidth: "150px" }}>
                            {this.renderMenuItems()}
                        </Menu>
                    }
                    trigger={['click']}
                >
                    {this.renderMenuHolder()}
                </Dropdown>
            </div>
        )
    }
}

export default withRouter(LeftMenu);
