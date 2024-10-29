import React from "react";
import styled from "styled-components";
import { PieChart } from "@mui/x-charts/PieChart";

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

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px; // Adjusted margin to give space below the legend
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
`;

const ColorBox = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background-color: ${({ color }) => color};
  margin-right: 6px;
`;

// Define a color palette for categories
const categoryColors = {
  chest: "#FF6384",   // Pink
  back: "#36A2EB",    // Blue
  legs: "#FFCE56",    // Yellow
  shoulders: "#4BC0C0", // Teal
  biceps: "#9966FF",  // Purple
  triceps: "#FF9F40", // Orange
  abs: "#FF5733",     // Red
  forearms: "#C70039", // Dark Red
  glutes: "#DAF7A6",  // Light Green
};

const CategoryChart = ({ data }) => {
  // Ensure percentages are parsed as numbers
  const pieChartData = data.map((category) => ({
    id: category.category,
    value: parseFloat(category.percentage), // Convert percentage to float
    color: categoryColors[category.category] || "#000000", // Default color if category not found
  }));

  return (
    <Card>
      <Title>Workout Categories Breakdown</Title>
      <LegendContainer>
        {pieChartData.map((category) => (
          <LegendItem key={category.id}>
            <ColorBox color={category.color} />
            <span>{category.id}</span>
          </LegendItem>
        ))}
      </LegendContainer>
      <PieChart
        series={[
          {
            data: pieChartData,
            innerRadius: 30,
            outerRadius: 120,
            paddingAngle: 5,
            cornerRadius: 5,
            tooltip: {
              trigger: 'item', // Show tooltips on hover
              formatter: (params) => `${params.id}: ${params.value.toFixed(2)}%`, // Format percentage to two decimal places
            },
          },
        ]}
        height={300}
      />
    </Card>
  );
};

export default CategoryChart;
