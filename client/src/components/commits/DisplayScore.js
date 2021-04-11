import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Collapse, Divider } from 'antd';
import './DisplayScore.css';

const { Panel } = Collapse;

const DisplayScore = () => {
  const {
    membersList,
    mergeRequestList,
    setMergeRequestList,
    selectUser,
  } = useAuth();

  console.log('mr', mergeRequestList);
  // for (let [nkey, nvalue] of Object.entries(notesList)) {
  //
  // }
  return (
    <div>
      <Collapse  style={{ margin:"10px 0px 20px 0px" }}>
        <Panel key="1" header="Total Scores">
          <div style={{ height:15 }} />
          <div className="TotalScoreContainer">
            <div className="scoreType">
              Student's Comments :
            </div>
            <div className="scoreNumber">
              Score
            </div>
          </div>
          {/*<b>Student's Comments : </b>*/}
          <Divider />
          <div className="TotalScoreContainer">
            <div className="scoreType">
              Merge Request :
            </div>
            <div className="scoreNumber">
              Score
            </div>
          </div>
          {/*<b>Merge Request : </b>*/}
          <Divider />
          <div className="TotalScoreContainer">
            <div style={{display:"flex"}}>
              <div className="scoreType">
                Each File Type :
              </div>
              <div className="fileContainer" style={{display:"flex", justifyContent:"space-between", width:100}}>
                <div className="fileType">
                  <div>
                    classname
                  </div>
                  <div>
                    classname
                  </div>
                  <div>
                    classname
                  </div>

                </div>
                <div className="fileScoreNumber">
                  Score
                </div>

              </div>
            </div>

          </div>
          {/*<b>Each File Type : </b>*/}
        </Panel>
      </Collapse>
      {/*<div style={{padding: "10px 50px 30px 30px", display:"flex", justifyContent:"center"}}>*/}
      {/*  /!*{selectUser}*!/*/}
      {/*  <Card size="small" title="Total Commit Score">*/}
      {/*    <div>A Score</div>*/}
      {/*  </Card>*/}
      {/*  <Card size="small" title="Total MR Score">*/}
      {/*    <div>A Score</div>*/}
      {/*  </Card>*/}
      {/*  <Card size="small" title="Total F">*/}
      {/*    <div>A Score</div>*/}
      {/*  </Card>*/}
      {/*</div>*/}
    </div>

  );



};
export default DisplayScore;