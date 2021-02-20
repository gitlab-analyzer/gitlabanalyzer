import React from "react";
import "./FloatBar.css";

import Data from './FloatBarData.json'

import HorizontalScroll from './Scroll'
var FloatBarData = Data.users;


function EveryoneScore() {
    const scrollRef = HorizontalScroll();

    return (
        <div className="floatbar-mid-container">
            <div className="floatbar-labels">
                <div className="rawscore-label">
                    raw score
                </div>
                <div className="remaining-labels">
                    <div>commits</div>
                    <div>lines of code</div>
                    <div>issues & reviews</div>
                </div>
            </div>
            <div className="floatbar-scores" ref={scrollRef}>
                {/* everyonescore */}
                <div className="data2" >
                    {FloatBarData.map((Detail, index) => {
                        return (
                            <div className="data">
                                <div className= "user">@{Detail.username}</div>
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


