import React from "react";
import styled from "styled-components";
import { BarChart } from "@mui/x-charts/BarChart";

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Stats = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const WeeklyStatCard = ({ data, title, keyField, avgCalories, totalCalories }) => {
  // Check if data is valid
  if (!data || data.length === 0) {
    return (
      <Card>
        <Title>{title}</Title>
        <p>No data available</p>
      </Card>
    );
  }

  const formattedData = {
    weeks: data.map((entry) => entry.date),
    values: data.map((entry) => entry[keyField]),
  };

  return (
    <Card>
      <Title>{title}</Title>
      <Stats>
        <div>Total Calories: {totalCalories}</div>
        <div>Average Calories: {avgCalories.toFixed(2)}</div>
      </Stats>
      <BarChart
        xAxis={[{ scaleType: "band", data: formattedData.weeks }]}
        series={[{ data: formattedData.values }]}
        height={300}
      />
    </Card>
  );
};

export default WeeklyStatCard;
