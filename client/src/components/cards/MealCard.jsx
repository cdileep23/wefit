import React from "react";
import styled from "styled-components";
import axios from "axios";
import { Delete, Fastfood, BreakfastDining, LunchDining, DinnerDining, Cake, Coffee } from "@mui/icons-material";

// Map of meal categories to their corresponding icons
const categoryIcons = {
  breakfast: <BreakfastDining />,
  lunch: <LunchDining />,
  dinner: <DinnerDining />,
  snack: <Fastfood />,
  brunch: <Fastfood />, // You can choose an appropriate icon
  coffee: <Coffee />, // Icon for coffee breaks
  dessert: <Cake />,
  appetizer: <Fastfood />, // You can choose an appropriate icon
  drink: <Fastfood />, // You can choose an appropriate icon
  lightMeal: <Fastfood />, // You can choose an appropriate icon
};

const Card = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 400px;
  padding: 16px 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 12px 14px;
  }
`;

const Category = styled.div`
  width: fit-content;
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  background: ${({ theme }) => theme.primary + 20};
  padding: 4px 10px;
  border-radius: 8px;
`;

const MealDetails = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;

  &:hover {
    color: red;
  }
`;

const MealCard = ({ meal, refreshMeals }) => {
  const deleteMeal = async () => {
    

    try {
      await axios.delete(`http://localhost:8080/api/meal/delete-meal/${meal._id}`, {
       
        withCredentials: true,
      });
      refreshMeals(); // Call to refresh the meals after deletion
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  return (
    <Card>
      <Category>#{meal?.category}</Category>
      <MealDetails>
        {categoryIcons[meal?.category.toLowerCase()] || <Fastfood />}
        {meal?.mealName} - {meal?.calories} calories
      </MealDetails>
      <DeleteButton onClick={deleteMeal}>
        <Delete />
      </DeleteButton>
    </Card>
  );
};

export default MealCard;
