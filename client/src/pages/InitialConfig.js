import React from 'react';
import { Form } from 'antd';
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
                    <LanguagePoints />
                    <IterationDates />
            </Form>

        </div>
    );
}
export default InitialConfig;


