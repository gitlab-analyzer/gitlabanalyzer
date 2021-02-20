import React from "react";
import Data from './FloatBarData.json'

var FloatBarData = Data.users;

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export default function IndividualScore(props) {
    let userkey = props.children;
    var useruser = FloatBarData.userkey;
    return (
       <div>
            {FloatBarData.map((Detail, index) => {
                if (Detail.username === props.children){
                    <div>{Detail.username}</div>
                    return (
                        <div className="individualscore">
                            {/* <div>{Detail.username}</div> */}
                            <div className="smallscore">
                                <div className="numberscore">{Detail.score}</div>
                                <div className="scoretext">raw score</div>
                            </div>
                            <div className="smallscore">
                                <div className="numberscore">{Detail.number_commits}</div>
                                <div className="scoretext">commits</div>
                               </div>
                            <div className="smallscore">
                                <div className="numberscore">{Detail.lines_of_code}</div>
                                <div className="scoretext">lines of code</div>
                            </div>
                            <div className="smallscore">
                                <div className="numberscore">{Detail.number_issues}</div>
                                <div className="scoretext">issues & reviews</div>
                            </div>
                        </div>
                        
                    );
                }
                // return (
                //     <div className="data">
                //         <div className= "user">@{Detail.username}</div>
                //         <div className="userscore">{Detail.score}</div>
                //         <div className="userscore_details">
                //             <div>{Detail.number_commits}</div>
                //             <div>{Detail.lines_of_code}</div>
                //             <div>{Detail.number_issues}</div>
                //         </div>
                //     </div>
                    
                // );
            })}
            <div>{getKeyByValue(FloatBarData, userkey)}</div>
        </div>
    );
}