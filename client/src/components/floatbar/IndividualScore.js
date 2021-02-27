import React from "react";
import { Progress } from 'antd';
import Data from './FloatBarData.json';
import './IndividualScore.css';

var FloatBarData = Data.users;

function IndividualScore(props) {
                return (
                        <div className="score-container">
                            <div className="rank">rank 1</div>
                            <div className="individualscore">
                                <div className="smallscore">
                                    <div className="numberscore">{6712}</div>
                                    <div className="scoretext">weighted score</div>
                                    <div className="progressbar">
                                        <Progress percent={50%100} size="small" status="active" strokeColor="#00ABFF"/>
                                    </div>
                                </div>
                                <div className="smallscore">
                                    <div className="numberscore">{812}</div>
                                    <div className="scoretext">commits</div>
                                    <div className="progressbar">
                                        <Progress percent={50%100} size="small" status="active" strokeColor="#85D6FE"/>
                                    </div>
                                </div>
                                <div className="smallscore">
                                    <div className="numberscore">{1298}</div>
                                    <div className="scoretext">lines of code</div>
                                    <div className="progressbar">
                                        <Progress percent={50%100} size="small" status="active" strokeColor="#85D6FE"/>
                                    </div>
                                </div>
                                <div className="smallscore">
                                    <div className="numberscore">{248}</div>
                                    <div className="scoretext">issues & reviews</div>
                                    <div className="progressbar">
                                        <Progress percent={50%100} size="small" status="active" strokeColor="#85D6FE"/>
                                    </div>
                                </div>
                            </div>
                        </div>
    );
}

export default IndividualScore;