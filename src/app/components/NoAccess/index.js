import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { withRouter } from "react-router";
import Loader from '../Loader';
import './index.scss';
import "antd/dist/antd.css";

class NoAccess extends Component {

    render() {
        return (
            <div className="noaccess">
                <Modal
                    visible={true}
                    footer={false}
                    closable={false}
                >
                    <div align="center">
                        <b><p className="ql-size-large" style={{ marginBottom: "0" }}>You must be logged in to view this page</p></b>
                        <Button onClick={() => this.props.history.push('/login?state')}>Open Login Page</Button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(NoAccess);
