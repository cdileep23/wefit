

WeFit - Workout and Meal Tracking Application

WeFit is a comprehensive fitness application designed to help users monitor their workouts, track daily and weekly meals, and measure calorie intake and expenditure over time. This project features both workout and meal tracking, empowering users to lead healthier lives with better insights into their fitness journey.

Features

1. User Authentication
- Users can securely sign up, log in, and authenticate using JWT tokens stored in cookies for enhanced security.
  
2. Workout Tracking
- Users can log their daily workouts by specifying key details such as workout name, category (e.g., chest, back, legs), number of sets, weight, and duration.
- Calories burned are automatically calculated based on the workout details.
- Workouts are stored with timestamps to track progress over time.

3. Meal Tracking
- Users can add meals for each day by specifying the meal name, category (e.g., breakfast, lunch, dinner), and calories.
- Total calories consumed are calculated for each day and displayed in the daily and weekly summaries.

4. Daily and Weekly Summaries
- The app provides daily and weekly summaries of total workouts, meals, calories burned, and calories consumed.
- The summary dashboard uses dynamic charts (PieChart, BarChart) for a better visual representation of progress.

5. Custom Calendar for Tracking
- Users can select a date using a calendar to view or log workouts and meals on specific days.
- The application allows easy navigation across different dates to review workout and meal history.

6. Error Handling
- The app uses a robust error-handling mechanism to provide meaningful feedback to users in case of any errors, ensuring a smooth user experience.

Tech Stack

- Front-End:
  - React.js
  - MUI (Material-UI) for UI components
  - Styled-components for styling
  - Charts from MUI x-charts (PieChart, BarChart) for data visualization
  - Day.js for handling dates

- Back-End:
  - Node.js with Express.js for building the RESTful API.
  - MongoDB as the NoSQL database to store workout and meal data.
  - JWT (JSON Web Tokens) for secure authentication and authorization.

Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wefit.git
   cd wefit
   ```

2. Install dependencies for both front-end and back-end:
   ```bash
   npm install
   cd client
   npm install
   ```

3. Set up your environment variables by creating a `.env` file in the root directory with the following values:
   ```env
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<your_jwt_secret>
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

API Endpoints

Workout Endpoints
- POST `/api/workout/add-workout`: Add a new workout with details like name, category, sets, weight, etc.
- GET `/api/workout/get-workout?date=YYYY-MM-DD`: Fetch workouts for a specific date.
  
Meal Endpoints
- POST `/api/meal/add-meal`: Add a new meal entry, including meal name, category, and calories.
- GET `/api/meal/get-meal?date=YYYY-MM-DD`: Fetch meals for a specific date.

Future Improvements

- Social Sharing: Allow users to share their workout progress with friends or on social media.
- Advanced Analytics: Provide more detailed analytics and insights based on users' workout and meal data.
- Mobile Application: Develop a mobile version of the app for Android and iOS for on-the-go tracking.

Contributing

1. Fork the project.
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request.

License

This project is licensed under the MIT License - see the LICENSE file for details.

---

This version removes all hash marks and asterisks. Let me know if you'd like any further edits!
