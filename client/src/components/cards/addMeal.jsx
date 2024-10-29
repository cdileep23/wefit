// components/AddMealForm.js
import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column; /* Default to vertical layout */
  align-items: center; /* Center horizontally */
  margin: 20px 0;

  @media (min-width: 600px) {
    flex-direction: row; /* Switch to horizontal layout on larger screens */
    justify-content: center; /* Center the items */
  }
`;

const InputField = styled(TextField)`
  margin: 10px; /* Add spacing around inputs */
`;

const AddMealForm = ({ refreshMeals }) => {
  const [mealName, setMealName] = useState("");
  const [category, setCategory] = useState("");
  const [calories, setCalories] = useState(""); // Keep as string for input
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

  const handleAddMeal = async () => {


    try {
      const response = await axios.post("http://localhost:8080/api/meal/add-meal", {
        mealName,
        category,
        calories: Number(calories), // Convert to number for sending
        date,
      }, {
       
        withCredentials: true,
      });

      if (response.data.success) {
        refreshMeals(); // Refresh meals after adding
        // Reset form fields
        setMealName("");
        setCategory("");
        setCalories("");
        setDate(new Date().toISOString().split('T')[0]);
      } else {
        console.error("Failed to add meal:", response.data.message);
      }
    } catch (error) {
      console.error("Error while adding meal:", error);
    }
  };

  return (
    <Container>
      <InputField
        label="Meal Name"
        value={mealName}
        onChange={(e) => setMealName(e.target.value)}
        required
      />
      <InputField
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <InputField
        type="number"
        label="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)} // Keep as string
        required
      />
      <InputField
        type="date"
        label="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button onClick={handleAddMeal} variant="contained" color="primary">Add Meal</Button>
    </Container>
  );
};

export default AddMealForm;
