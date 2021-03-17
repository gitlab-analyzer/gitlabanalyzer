import React from 'react';
import { ScoreCalculator, barData } from './EveryoneScore';
import { Button, Card, Popover } from 'antd';
// import './IndividualScore.css';

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
                  {ScoreCalculator(user).toFixed(0)}
                </Button>
              </Popover>
              <Popover 
                trigger="hover"
                content="Number of Commits"
                placement="bottom"
              >
                <Button>
                  {Detail.commits}
                </Button>
              </Popover>
              <Popover 
                trigger="hover"
                content="Lines of Code"
                placement="bottom"
              >
                <Button>
                  {Detail.code}
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
