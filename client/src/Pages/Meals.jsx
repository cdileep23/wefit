import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import styled from "styled-components";
import MealCard from "../components/cards/MealCard"; // Assuming MealCard is created like WorkoutCard
import AddMeal from "../components/cards/addMeal"; // Import AddMeal component
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import { CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import Navbar from "../components/Navbar";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1600px;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 0.2;
  height: fit-content;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Right = styled.div`
  flex: 1;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const SecTitle = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const Meals = () => {
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const navigate = useNavigate(); // Add useNavigate hook

  const getTodaysMeals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/meal/get-meal?date=${date}`, {
        withCredentials: true,
      });
      setTodaysMeals(response.data.todaysMeals);
      setTotalCalories(response.data.totalCaloriesConsumed);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to check if user token is valid
  const checkUserToken = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user/check-user", {
        withCredentials: true,
      });
      const data = response.data;

      if (!data.success) {
        // Redirect to sign-in page if token is invalid
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error checking token:", error);
      navigate("/signin"); // On error, redirect to sign-in page
    }
  };

  const refreshMeals = () => {
    getTodaysMeals();
  };

  useEffect(() => {
    checkUserToken(); // Check token on component mount
  }, []);

  useEffect(() => {
    if (date) {
      getTodaysMeals();
    }
  }, [date]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    setDate(formattedDate);
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        <Wrapper>
          <Left>
            <Title>Select Date</Title>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar onChange={(e) => setDate(`${e.$M + 1}/${e.$D}/${e.$y}`)} />
            </LocalizationProvider>
          </Left>
          <Right>
            <Section>
              <SecTitle>Today's Meals</SecTitle>
              <AddMeal refreshMeals={refreshMeals} buttonLoading={loading} /> {/* Add Meal Component */}
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  <Typography variant="h6" color="textSecondary">
                    Total Calories Consumed: {totalCalories} kcal
                  </Typography>
                  {todaysMeals.length > 0 ? (
                    <CardWrapper>
                      {todaysMeals.map((meal) => (
                        <MealCard key={meal._id} meal={meal} refreshMeals={refreshMeals} />
                      ))}
                    </CardWrapper>
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No meals logged for this date.
                    </Typography>
                  )}
                </>
              )}
            </Section>
          </Right>
        </Wrapper>
      </Container>
    </>
  );
};

export default Meals;
