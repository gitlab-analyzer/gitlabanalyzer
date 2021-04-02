import React from 'react';
import { Form, Divider } from 'antd';
import LanguagePoints from '../components/config/LanguagePoints';
import IterationDates from '../components/config/IterationDates';
import InitialUserDates from '../components/config/InitialUserDates';
import AnonymousViewing from '../components/config/AnonymousViewing';

function InitialConfig() {
    return (        
        <Form 
            layout="vertical"
        >
                <InitialUserDates />
                <Divider />
                <LanguagePoints />
                <Divider />
                <IterationDates />
                <Divider />
                <AnonymousViewing />
        </Form>
    );
}
export default InitialConfig;

