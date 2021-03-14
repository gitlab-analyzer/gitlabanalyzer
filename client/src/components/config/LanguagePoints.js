import React from 'react';
import { Form, InputNumber, Col, Row } from 'antd';
import { setting } from '../../pages/InitialConfig';

function LanguagePoints() {
    return (
        <div>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        label="JavaScript"
                        name="javascript"
                        rules={[
                            { 
                                required: true, 
                                message: 'Please input a number.', 
                            },
                        ]}
                    >
                        <InputNumber 
                            defaultValue={1}
                            onChange={value => setting.java = value} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="Python"
                        name="python"
                        rules={[
                            {
                                required: true,
                                message: 'Please input a number.',
                            },
                        ]}
                    >
                        <InputNumber 
                            defaultValue={1}
                            onChange={value => setting.python = value} 
                        />
                    </Form.Item>
                </Col>    
                <Col span={8}>
                    <Form.Item
                        label="HTML"
                        name="html"
                        rules={[
                            {
                                required: true,
                                message: 'Please input a number.',
                            },
                        ]}
                    >
                        <InputNumber 
                            defaultValue={1}
                            onChange={value => setting.html = value} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="CSS"
                        name="css"
                        rules={[
                            {
                                required: true,
                                message: 'Please input a number.',
                            },
                        ]}
                    >
                        <InputNumber 
                            defaultValue={1}
                            onChange={value => setting.css = value} 
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );

}

export default LanguagePoints;