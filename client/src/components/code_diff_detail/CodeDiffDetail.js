import React from 'react';
import {Popover, Button} from 'antd'
import './CodeDuffDetauk.css'
import CodeDiffTextFields from "./CodeDiffTextFields";

const CodeDiffDetail = (props) => {
    const exampleScoreDetail = {
        "lines_added": 0,
        "lines_deleted": 0,
        "comments_added": 2,
        "comments_deleted": 70,
        "blanks_added": 0,
        "blanks_deleted": 0,
        "spacing_changes": 0,
        "syntax_changes": 8
    };

    const exampleMultiplier = {
        "lines_added": 0.1,
        "lines_deleted": 0.2,
        "comments_added": 2.5,
        "comments_deleted": 7,
        "blanks_added": 1.2,
        "blanks_deleted": 2.1,
        "spacing_changes": 1.2,
        "syntax_changes": 8
    };

    return (
        <div className="wrapper">
            <Popover content={CodeDiffTextFields(exampleScoreDetail, exampleMultiplier)} title={"Score Breakdown"} trigger={"click"}>
                <Button type={"primary"} name={Button} className={Button}>Score Detail</Button>
            </Popover>
        </div>
    );
};

export default CodeDiffDetail
