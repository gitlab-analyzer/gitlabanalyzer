import React from 'react';
import { Form, InputNumber, Col, Row } from 'antd';
import { configSettings } from '../login/Repo';

function LanguagePoints() {
    return (
        <div>
            <h6>Language Points</h6>
            <Row gutter={48} >
                <Col >
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
                            defaultValue={(configSettings.javascript && configSettings.javascript) || 1}
                            onChange={value => configSettings.javascript = value} 
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
                            defaultValue={(configSettings.python && configSettings.python) || 1}
                            onChange={value => configSettings.python = value} 
                        />
                    </Form.Item>
                </Col>    
                <Col >
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
                            defaultValue={(configSettings.html && configSettings.html) || 1}
                            onChange={value => configSettings.html = value} 
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
                            defaultValue={(configSettings.css && configSettings.css) || 1}
                            onChange={value => configSettings.css = value} 
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
}

export default LanguagePoints;