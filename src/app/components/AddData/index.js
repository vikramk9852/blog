import React, { Component } from 'react';
import { Button, Form, Input, Row, Col, message } from 'antd';
import { withRouter } from 'react-router-dom';
import './index.scss';
import "antd/dist/antd.css";

class HomePage extends Component {

    constructor(props){
        super(props);
        this.handleCancel = this.handleCancel.bind(this)
    }

    handleCancel=()=>{
        this.props.initialState();
    }

    handleSubmit=()=>{
        this.props.form.validateFields((err, values) => {
            console.log(values);
        })
    }
    
    render(){
        const { getFieldDecorator } = this.props.form;

        return(
        <div>
        <Form onSubmit={this.handleSubmit} className="addData">
            <Form.Item>
            {getFieldDecorator('uniqueKey', {
                rules: [{ required: true, message: 'Please enter unique key for this Data!' }],
            })(
                <Input placeholder="Unique Key" />
            )}
            </Form.Item>
            <Form.Item>
            {getFieldDecorator('contents', {
                rules: [{ required: true, message: 'Please Enter Contents!' }],
            })(
                <Input placeholder="Contents" />
            )}
            </Form.Item>
            <Row gutter={12}>
                <div>
                    <Col lg={12} md={12} sm={12} xs={12} align="center">
                        <div className=""><Button onClick={this.handleSubmit} icon="upload">Add</Button></div>
                    </Col>
                    <Col md={2} sm={2} xs={12}></Col>

                    <Col lg={12} md={12} sm={12} xs={12} align="center">
                        <div className=""></div><Button onClick={this.handleCancel} icon="close">Cancel</Button> 
                    </Col>
                </div>
            </Row>
        </Form>
        </div>
        )
    }
}

export default withRouter (Form.create({name:"create an account"})(HomePage));
