import React from "react";
import { Progress } from 'antd';
import Data from './FloatBarData.json';
import './IndividualScore.css';

var FloatBarData = Data.users;

function IndividualScore(props) {
    return (
       <div>
            {FloatBarData.map((Detail) => {
                if (Detail.username === props.children){
                    <div>{Detail.username}</div>
                    return (
                        <div className="score-container">
                            <div className="rank">rank #</div>
                            <div className="individualscore">
                                {/* <div>{Detail.username}</div> */}
                                <div className="smallscore">
                                    <div className="numberscore">{Detail.score}</div>
                                    <div className="scoretext">weighted score</div>
                                    <div className="progressbar">
                                        <Progress percent={Detail.score%100} size="small" status="active" strokeColor="#00ABFF"/>
                                    </div>
                                </div>
                                <div className="smallscore">
                                    <div className="numberscore">{Detail.number_commits}</div>
                                    <div className="scoretext">commits</div>
                                    <div className="progressbar">
                                        <Progress percent={Detail.number_commits%100} size="small" status="active" strokeColor="#85D6FE"/>
                                    </div>
                                </div>
                                <div className="smallscore">
                                    <div className="numberscore">{Detail.lines_of_code}</div>
                                    <div className="scoretext">lines of code</div>
                                    <div className="progressbar">
                                        <Progress percent={Detail.lines_of_code%100} size="small" status="active" strokeColor="#85D6FE"/>
                                    </div>
                                </div>
                                <div className="smallscore">
                                    <div className="numberscore">{Detail.number_issues}</div>
                                    <div className="scoretext">issues & reviews</div>
                                    <div className="progressbar">
                                        <Progress percent={Detail.number_issues%100} size="small" status="active" strokeColor="#85D6FE"/>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                    );
                }
            })}
        </div>
    );
}

export default IndividualScore;