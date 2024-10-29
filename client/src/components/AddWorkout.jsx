import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

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

const Input = styled.input`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
  margin-bottom: 10px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px 16px;
  background-color: ${({ theme }) => theme.primary};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    background-color: #ccc;
  }
`;

const AddWorkout = ({ refreshDashboard, buttonLoading }) => {
  const [workoutDetails, setWorkoutDetails] = useState({
    category: "",
    workoutName: "",
    sets: 0,
    weight: 0,
    duration: 0,
    date: new Date().toISOString().substring(0, 10), // Set default date to today
  });

  const handleChange = (e) => {
    setWorkoutDetails({
      ...workoutDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddWorkout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/workout/add-workout",
        {
          category: workoutDetails.category,
          workoutName: workoutDetails.workoutName,
          sets: parseInt(workoutDetails.sets),
          weight: parseFloat(workoutDetails.weight),
          duration: parseFloat(workoutDetails.duration),
          date: workoutDetails.date, // Pass the date
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log(response.data);
        refreshDashboard();

        // Reset workout details after successful addition
        setWorkoutDetails({
          category: "",
          workoutName: "",
          sets: 0,
          weight: 0,
          duration: 0,
          date: new Date().toISOString().substring(0, 10), // Reset to today
        });
      } else {
        console.error("Failed to add workout:", response.data.message);
      }
    } catch (error) {
      console.error("Error while adding workout:", error);
    }
  };

  return (
    <Card>
      <Title>Add Workout</Title>
      <Input
        type="text"
        name="category"
        placeholder="Workout Category"
        value={workoutDetails.category}
        onChange={handleChange}
      />
      <Input
        type="text"
        name="workoutName"
        placeholder="Workout Name"
        value={workoutDetails.workoutName}
        onChange={handleChange}
      />
      <Input
        type="number"
        name="sets"
        placeholder="Sets"
        value={workoutDetails.sets}
        onChange={handleChange}
      />
      <Input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        value={workoutDetails.weight}
        onChange={handleChange}
      />
      <Input
        type="number"
        name="duration"
        placeholder="Duration (minutes)"
        value={workoutDetails.duration}
        onChange={handleChange}
      />
      <Input
        type="date"
        name="date"
        value={workoutDetails.date}
        onChange={handleChange}
      />
      <Button onClick={handleAddWorkout} disabled={buttonLoading}>
        {buttonLoading ? "Adding..." : "Add Workout"}
      </Button>
    </Card>
  );
};

export default AddWorkout;
