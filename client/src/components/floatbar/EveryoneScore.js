import React from "react";
import Data from './FloatBarData.json'
import HorizontalScroll from './Scroll'
import "./EveryoneScore.css";

var FloatBarData = Data.users;

const usercolours = ["#b0911d", "#1d2cb0", "#1db084", "#0091e3", "#489850", "#bb4824", "#a34d9a", "#ab3ca6"];
function EveryoneScore() {
    const scrollRef = HorizontalScroll();

    return (
        <div className="floatbar-mid-container">
            <div className="floatbar-labels">
                <div className="rawscore-label">
                    weighted score
                </div>
                <div className="remaining-labels">
                    <div>commits</div>
                    <div>lines of code</div>
                    <div>issues & reviews</div>
                </div>
            </div>
            <div className="floatbar-scores" ref={scrollRef}>
                <div className="floatbar-map-container" >
                    {FloatBarData.map((Detail, index) => {
                        return (
                            <div className="score-array">
                                <div className= "user" style={{color: usercolours[index]}}>@{Detail.username}</div>
                                <div className="userscore">{Detail.score}</div>
                                <div className="userscore_details">
                                    <div>{Detail.number_commits}</div>
                                    <div>{Detail.lines_of_code}</div>
                                    <div>{Detail.number_issues}</div>
                                </div>
                            </div>                            
                        );
                    })}
                </div>            
            </div>
        </div>
    );
}

export default EveryoneScore;


