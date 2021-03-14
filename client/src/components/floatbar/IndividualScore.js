import React from 'react';
import './IndividualScore.css';
import { Card } from 'antd';

function IndividualScore({ user }) {
  return (
    <div>
      <div className="cardContainer">
        <Card title={3200}>Weighted Score</Card>
        <Card title={52}>Number of Commits</Card>
        <Card title={1752}>Lines of Code</Card>
        <Card title={42}>Issues & Reviews</Card>
      </div>
    </div>
  );
}

export default IndividualScore;
