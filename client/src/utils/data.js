import {
  FitnessCenterRounded,
  LocalFireDepartmentRounded,
  TimelineRounded,
  RestaurantRounded,
} from "@mui/icons-material";
export const counts = [
  {
    id: 1, // Add unique id
    name: "Calories Burned",
    icon: (
      <LocalFireDepartmentRounded sx={{ color: "inherit", fontSize: "26px" }} />
    ),
    desc: "Total calories burned today",
    key: "totalCaloriesBurned",
    unit: "kcal",
    color: "#eb9e34",
    lightColor: "#FDF4EA",
  },
  {
    id: 2, // Add unique id
    name: "Workouts",
    icon: <FitnessCenterRounded sx={{ color: "inherit", fontSize: "26px" }} />,
    desc: "Total number of workouts today",
    key: "totalWorkouts",
    unit: "",
    color: "#41C1A6",
    lightColor: "#E8F6F3",
  },
  {
    id: 3, // Add unique id
    name: "Calories Consumed",
    icon: <TimelineRounded sx={{ color: "inherit", fontSize: "26px" }} />,
    desc: "Total calories consumed today",
    key: "totalCaloriesConsumed",
    unit: "kcal",
    color: "#FF6347",
    lightColor: "#FFE8E5",
  },
  {
    id: 4, // Add unique id
    name: "Meals Taken",
    icon: <RestaurantRounded sx={{ color: "inherit", fontSize: "26px" }} />,
    desc: "Total meals taken today",
    key: "totalMeals",
    unit: "",
    color: "#FFA500",
    lightColor: "#FFF4E0",
  },
];
