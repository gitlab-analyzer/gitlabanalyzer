import React from 'react';
import { ScoreCalculator, barData } from './EveryoneScore';
import { Card } from 'antd';
import './IndividualScore.css';

function IndividualScore({ user }) {
  return (
    <div>
      <div className="cardContainer">
        {barData.map((Detail) => {
          if (Detail.name === user) {
            return (
              <div style={{ display: 'flex', width: '100%' }}>
                <Card title={ScoreCalculator(user).toFixed(0)}>
                  Weighted Score
                </Card>
                <Card title={Detail.commits}>Number of Commits</Card>
                <Card title={Detail.code}>Lines of Code</Card>
                <Card title={Detail.issue}>Issues & Reviews</Card>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default IndividualScore;
