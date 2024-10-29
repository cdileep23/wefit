import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import TextInput from "./TextInput";
import Button from "./Button";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate
import LogoImage from "../utils/Images/Logo.png"; // Import your logo image
import AuthImage from "../utils/Images/AuthImage.png"; // Import your background image

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  background: ${({ theme }) => theme.bg};
  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  position: relative;
  @media (max-width: 700px) {
    display: none;
  }
`;

const Logo = styled.img`
  position: absolute;
  width: 70px;
  top: 40px;
  left: 60px;
  z-index: 10;
`;

const Image = styled.img`
  position: relative;
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const Right = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px;
  gap: 16px;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

const Text = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
  display: flex;
  align-items: center;
`;

const TextButton = styled.span`
  color: ${({ theme }) => theme.primary}; /* Change this to your theme's primary color */
  cursor: pointer;
  &:hover {
    text-decoration: underline; /* Add underline on hover for better UX */
  }
`;

const SignUp = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const validateInputs = () => {
    if (!name || !email || !password || !age || !height || !weight) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    setLoading(true);
    setButtonDisabled(true);
    if (validateInputs()) {
      try {
        const response = await axios.post("http://localhost:8080/api/user/register", {
          name,
          email,
          password,
          age: Number(age), // Ensure age is a number
          height: parseFloat(height), // Ensure height is a float
          weight: parseFloat(weight), // Ensure weight is a float
        });
        alert("Account Created Successfully");
        navigate("/signin"); // Navigate to the sign-in page
      } catch (err) {
        alert(err.response.data.message || "An error occurred");
      } finally {
        setLoading(false);
        setButtonDisabled(false);
      }
    } else {
      setLoading(false);
      setButtonDisabled(false);
    }
  };

  useEffect(() => {
    const isAuthenticated = !!Cookies.get("token");
    if (isAuthenticated) {
      navigate("/"); // Redirect to dashboard if authenticated
    }
  }, [navigate]);

  return (
    <Container>
      <Left>
        <Logo src={LogoImage} />
        <Image src={AuthImage} />
      </Left>
      <Right>
        <div>
          <Title>Create New Account 👋</Title>
          <Span>Please enter details to create a new account</Span>
        </div>
        <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            handleChange={(e) => setName(e.target.value)}
          />
          <TextInput
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            password
            value={password}
            handleChange={(e) => setPassword(e.target.value)}
          />
          <TextInput
            label="Age"
            placeholder="Enter your age"
            value={age}
            handleChange={(e) => setAge(e.target.value)}
          />
          <TextInput
            label="Height (ft)"
            placeholder="Enter your height"
            value={height}
            handleChange={(e) => setHeight(e.target.value)}
          />
          <TextInput
            label="Weight (kg)"
            placeholder="Enter your weight"
            value={weight}
            handleChange={(e) => setWeight(e.target.value)}
          />
          <Button
            text="Sign Up"
            onClick={handleSignUp}
            isLoading={loading}
            isDisabled={buttonDisabled}
          />
        </div>
        <Text>
          Already have an account?{" "}
          <TextButton onClick={() => navigate("/signin")}>Sign In</TextButton>
        </Text>
      </Right>
    </Container>
  );
};

export default SignUp;
