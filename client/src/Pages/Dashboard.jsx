import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import CountsCard from "../components/cards/CountsCard";
import { counts } from "../utils/data";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import { useNavigate } from "react-router-dom"; // For redirecting to sign-in

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column; /* Stack children vertically */
  height: 100vh; /* Ensure full height of the viewport */
  padding: 22px;
  overflow-y: auto; /* Enable vertical scrolling */
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  overflow-y: auto; /* Allow wrapper content to scroll if it overflows */
  padding: 0 16px; /* Optional: add padding to wrapper */

  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const SummaryComponent = () => {
  const navigate = useNavigate(); // Used for redirecting
  const [loading, setLoading] = useState(false);

  // Daily Summary State
  const [dailySummary, setDailySummary] = useState({
    totalWorkouts: 0,
    totalMeals: 0,
    totalCaloriesBurned: 0,
    totalCaloriesConsumed: 0,
  });

  // Weekly Summary State
  const [weeklySummary, setWeeklySummary] = useState({
    totalCaloriesBurned: 0,
    totalCaloriesConsumed: 0,
    avgCaloriesBurned: 0,
    avgCaloriesConsumed: 0,
  });

  // Weekly Data States
  const [weeklyDataCalorieBurned, setWeeklyDataCalorieBurned] = useState([]);
  const [weeklyDataCalorieConsumed, setWeeklyDataCalorieConsumed] = useState([]);
  const [categoryPercentages, setCategoryPercentages] = useState([]);

  // Check if token exists and is valid
  const checkUserToken = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/user/check-user", 
        { withCredentials: true }
      );
      const data = response.data;

      if (!data.success) {
        // If the token is invalid or not found, redirect to the sign-in page
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error checking token:", error);
      // On error, redirect to the sign-in page
      navigate("/signin");
    }
  };

  // Function to fetch the summary data
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/user/get-summary",
        { withCredentials: true }
      );
      const summaryData = response.data;

      // Update daily summary state
      setDailySummary({
        totalWorkouts: summaryData.dailySummary.totalWorkouts,
        totalMeals: summaryData.dailySummary.totalMeals,
        totalCaloriesBurned: summaryData.dailySummary.totalCaloriesBurned,
        totalCaloriesConsumed: summaryData.dailySummary.totalCaloriesConsumed,
      });

      // Update weekly summary state
      setWeeklySummary({
        totalCaloriesBurned: summaryData.weeklySummary.totalCaloriesBurned,
        totalCaloriesConsumed: summaryData.weeklySummary.totalCaloriesConsumed,
        avgCaloriesBurned: summaryData.weeklySummary.avgCaloriesBurned,
        avgCaloriesConsumed: summaryData.weeklySummary.avgCaloriesConsumed,
      });

      // Update weekly data states
      setWeeklyDataCalorieBurned(summaryData.weeklySummary.weeklyDataCalorieBurned);
      setWeeklyDataCalorieConsumed(summaryData.weeklySummary.weeklyDataCalorieConsumed);
      setCategoryPercentages(summaryData.weeklySummary.categoryPercentages);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check token and fetch summary data on component mount
  useEffect(() => {
    checkUserToken(); // Check if the user is authenticated
    fetchSummary();   // Fetch the summary data
  }, []);

  return (
    <div>
      <Navbar />
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <Container>
          <Wrapper>
            <Title>Dashboard</Title>
            <FlexWrap>
              {counts.map((item) => (
                <CountsCard key={item.id} item={item} data={dailySummary} /> 
              ))}
            </FlexWrap>

            <FlexWrap>
              <WeeklyStatCard
                data={weeklyDataCalorieBurned}
                title="Weekly Calories Burned"
                keyField="caloriesBurned"
                totalCalories={weeklySummary.totalCaloriesBurned}
                avgCalories={weeklySummary.avgCaloriesBurned}
              />
              <WeeklyStatCard
                data={weeklyDataCalorieConsumed}
                title="Weekly Calories Consumed"
                keyField="caloriesConsumed"
                totalCalories={weeklySummary.totalCaloriesConsumed}
                avgCalories={weeklySummary.avgCaloriesConsumed}
              />
              <CategoryChart data={categoryPercentages} />
            </FlexWrap>
          </Wrapper>
        </Container>
      )}
    </div>
  );
};

export default SummaryComponent;
