import { ThemeProvider, styled } from "styled-components";
import { lightTheme } from "./utils/Themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn"; 
import SignUp from "./components/SignUp"; 
import Dashboard from "./Pages/Dashboard";
import Workouts from "./Pages/Workouts";
import Meals from "./Pages/Meals";
import Tutorials from "./Pages/Tutorials";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Container>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/tutorials" element={<Tutorials />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
