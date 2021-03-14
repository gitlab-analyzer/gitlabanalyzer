import React from 'react';
import HorizontalScroll from './Scroll';
import ScoreCalculator from './ScoreCalculator';
import Data from './FloatBarData.json';
import './EveryoneScore.css';
import { useAuth } from '../../context/AuthContext';

var FloatBarData = Data.users;

const usercolours = ['#b0911d', '#1d2cb0', '#1db084', '#0091e3', '#489850', '#bb4824', '#a34d9a', '#ab3ca6'];
function EveryoneScore() {
    const {
        membersList,
        usersList,
        commitsList,
        notesList,
        mergeRequestList,
        commentsList,
      } = useAuth();
    console.log(membersList)
    // console.log(usersList)
    // console.log(commitsList)
    // console.log(notesList)
    // console.log(mergeRequestList)
    // // console.log(commentsList)
    // let localMember
    // React.useEffect(() => {
    //     localStorage.setItem('memberData', JSON.stringify(membersList));
    //     // localMember = JSON.parse(localStorage.getItem(membersList));
    // });
   
    // let localMember = (localStorage.getItem('myKey'));

    // React.useEffect(() => {
    //     localStorage.setItem('myKey', JSON.stringify(membersList));
    // }, [membersList]);
    
    // React.useEffect(() => {
    //     if(localStorage.getItem('myKey')) {
    //         localMember = (localStorage.getItem('myKey'));
    //     }
    // }, []);
    const scrollRef = HorizontalScroll();
    const localMember = localStorage.getItem('myKey');
    const [memberData, setMemberData] = React.useState(JSON.parse(localMember))
    console.log(memberData)

    return (
        <div className="floatbarContainer">
            <div className="floatbarLabels">
                <div className="scoreLabel">
                    weighted score
                </div>
                <div className="remainingLabels">
                    <div>commits</div>
                    <div>lines of code</div>
                    <div>issues & reviews</div>
                </div>
            </div>
            <div className="scoreContainer" ref={scrollRef}>
                <div className="fbMapContainer">
                    {FloatBarData.map((Detail, index) => {
                        return (
                            <div className="scoreArray">
                                <div className="user" style={{color: usercolours[index]}}>@{Detail.username}</div>
                                <div className="userScore">
                                    {ScoreCalculator(Detail.number_commits, Detail.lines_of_code, Detail.number_issues)}
                                </div>
                                <div className="userScoreDetails">
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


