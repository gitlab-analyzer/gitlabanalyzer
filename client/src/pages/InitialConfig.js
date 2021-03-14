import React from 'react';
import { Form, Divider } from 'antd';
import LanguagePoints from '../components/config/LanguagePoints.js';
import IterationDates from '../components/config/IterationDates.js'
import InitialUserDates from '../components/config/InitialUserDates.js'

function InitialConfig() {
    return (        
        <div>
            <Form 
                layout="vertical"
            >
                    <InitialUserDates />
                    <Divider />
                    <LanguagePoints />
                    <Divider />
                    <IterationDates />
            </Form>

        </div>
    );
}
export default InitialConfig;


