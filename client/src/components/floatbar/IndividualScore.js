import React from "react";
// import { Progress } from 'antd';
import Data from './FloatBarData.json';
import './IndividualScore.css';
import { Card } from 'antd';

var FloatBarData = Data.users;

function IndividualScore(props) {
    return (
       <div>
            {FloatBarData.map((Detail) => {
                if (Detail.username === props.children){
                    <div>{Detail.username}</div>
                    return (
                        <div className = "cardContainer">
                            <Card title = {Detail.score}>                
                                Weighted Score
                            </Card>
                            <Card title = {Detail.number_commits}>                
                                Number of Commits
                            </Card>
                            <Card title = {Detail.lines_of_code}>                
                                Lines of Code
                            </Card>
                            <Card title = {Detail.number_issues}>                
                                Issues & Reviews
                            </Card>
                        </div>
                    );
                }
            })}
        </div>
    );
}

export default IndividualScore;