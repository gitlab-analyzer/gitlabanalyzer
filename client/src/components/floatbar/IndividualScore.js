import React from 'react';
import { barData } from './EveryoneScore';
import { Button, Popover } from 'antd';

function IndividualScore({ user }) {
  return (
    <div className="cardContainer">
      {barData.map((Detail) => {
        if (Detail.name === user) {
          return (
            <div style={{ 
                display:'grid', 
                gridAutoFlow:'column',
                gridTemplateColumns:'100px 100px 100px 100px',
                gridColumnGap:'10px',
              }}
            >
              <Popover 
                trigger="hover"
                content="Weighted Score"
                placement="bottom"
              >
                <Button>
                  {Detail.weightscore.toFixed(0)}
                </Button>
              </Popover>
              <Popover 
                trigger="hover"
                content="Number of Commits"
                placement="bottom"
              >
                <Button>
                  {Detail.cmcount}
                </Button>
              </Popover>
              <Popover 
                trigger="hover"
                content="Number of Merge Requests"
                placement="bottom"
              >
                <Button>
                  {Detail.mrcount}
                </Button>
              </Popover>
              <Popover 
                trigger="hover"
                content="Issues & Reviews"
                placement="bottom"
              >
                <Button>
                  {Detail.issue}
                </Button>
              </Popover>
            </div>
          );
        }
      })}
    </div>
  );
}

export default IndividualScore;
