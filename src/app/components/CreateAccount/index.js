import React, { Component } from 'react';
import { Button, Form, Input, Row, Col } from 'antd';
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
        <Form onSubmit={this.handleSubmit} className="createAccount">
            <Form.Item>
            {getFieldDecorator('name', {
                rules: [{ required: false, message: 'Please input your Name!' }],
            })(
                <Input placeholder="Name" />
            )}
            </Form.Item>
            <Form.Item>
            {getFieldDecorator('userName', {
                rules: [{ required: false, message: 'Please input your UserName!' }],
            })(
                <Input placeholder="UserName" />
            )}
            </Form.Item>
            <Form.Item>
            {getFieldDecorator('email', {
                rules: [{ required: false, message: '' }],
            })(
                <Input placeholder="E-mail" />
            )}
            </Form.Item>            
            <Form.Item>
            {getFieldDecorator('contact', {
                rules: [{ required: false, message: '' }],
            })(
                <Input placeholder="Contact" />
            )}
            </Form.Item>
            <Row gutter={12} className="createWallet__responseButton gutter-example">
                <div className="createWallet__responseButton_box">
                    <Col className="gutter-row" lg={12} md={12} sm={12} xs={12} align="center">
                        <div className=""><Button className="roundedTransparent" onClick={this.handleSubmit} icon="user-add">Create</Button></div>
                    </Col>
                    <Col md={2} sm={2} xs={12}></Col>

                    <Col className="gutter-row" lg={12} md={12} sm={12} xs={12} align="center">
                        <div className=""></div><Button className="roundedColor"onClick={this.handleCancel} icon="close">Cancel</Button> 
                    </Col>
                </div>
            </Row>
        </Form>
        </div>
        )
    }
}

export default withRouter (Form.create({name:"create an account"})(HomePage));
