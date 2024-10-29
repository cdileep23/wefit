import React, { useEffect, useState } from "react";
import styled from "styled-components";
import WorkoutCard from "../components/cards/WorkoutCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import { CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import Navbar from "../components/Navbar";
import AddWorkout from "../components/AddWorkout"; // Import AddWorkout component
import { useNavigate } from "react-router-dom"; // Import for navigation

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

const Card = styled.div`
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

const TotalCalories = styled(Typography)`
  margin-top: 16px;
`;

const Workouts = () => {
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const navigate = useNavigate(); // Use navigate for redirection

  // Check if user is authenticated
  const checkUserToken = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user/check-user", {
        withCredentials: true,
      });
      if (!response.data.success) {
        navigate("/signin"); // Redirect to sign-in if not authenticated
      }
    } catch (error) {
      console.error("Error checking token:", error);
      navigate("/signin"); // Redirect on error
    }
  };

  const getTodaysWorkout = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/workout/get-workout?date=${date}`, {
        withCredentials: true,
      });
      setTodaysWorkouts(response.data.todaysWorkouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate total calories burned
  const calculateTotalCaloriesBurned = () => {
    const totalCalories = todaysWorkouts.reduce((total, workout) => {
      return total + (workout.caloriesBurned || 0); // Ensure 'caloriesBurned' is the correct property name
    }, 0);
    setTotalCaloriesBurned(totalCalories);
  };

  // Function to refresh workouts
  const refreshWorkouts = () => {
    getTodaysWorkout(); // Call to refresh the workouts
  };

  useEffect(() => {
    checkUserToken(); // Check user authentication on component mount
    if (date) {
      getTodaysWorkout();
    }
  }, [date]);

  useEffect(() => {
    // Default to today's date
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    setDate(formattedDate);
  }, []);

  useEffect(() => {
    // Calculate total calories whenever today's workouts change
    calculateTotalCaloriesBurned();
  }, [todaysWorkouts]);

  return (
    <>
      <Navbar />
      <Container>
        <Wrapper>
          {/* Card for Adding Workout */}
          <CardWrapper>
            <AddWorkout refreshDashboard={refreshWorkouts} buttonLoading={loading} />
          </CardWrapper>

          {/* Card for Calendar */}
          <Card>
            <Title>Select Date</Title>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                onChange={(e) => setDate(`${e.$M + 1}/${e.$D}/${e.$y}`)}
              />
            </LocalizationProvider>
          </Card>

          <Right>
            <Section>
              <SecTitle>Today's Workout</SecTitle>
              {loading ? (
                <CircularProgress />
              ) : todaysWorkouts.length > 0 ? (
                <>
                  <TotalCalories variant="h6">
                    Total Calories Burned: {totalCaloriesBurned}
                  </TotalCalories>
                  <CardWrapper>
                    {todaysWorkouts.map((workout) => (
                      <WorkoutCard key={workout._id} workout={workout} refreshWorkouts={refreshWorkouts} />
                    ))}
                  </CardWrapper>
                </>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No workouts logged for this date.
                </Typography>
              )}
            </Section>
          </Right>
        </Wrapper>
      </Container>
    </>
  );
};

export default Workouts;
