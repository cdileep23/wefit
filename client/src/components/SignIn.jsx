import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Cookies from "js-cookie"; // For cookie management
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
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
`;

const TextButton = styled.span`
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.primaryDark}; 
  }
`;

const SignIn = () => {
  
  const navigate = useNavigate();

 
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const validateInputs = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    setLoading(true);
    setButtonDisabled(true);
    if (validateInputs()) {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/user/login",
          { email, password },
          { withCredentials: true }
        );

        const res = response.data;
        console.log(res);
        if (res.success) {
          console.log(res)
         
          Cookies.set("token", res.token, { expires: 7 }); // Store token in cookie
          alert("Login Success");
          navigate('/'); 
          console.log("eror")
          // Navigate to the dashboard
        }
      } catch (err) {
        alert(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
        setButtonDisabled(false);
      }
    } else {
      setLoading(false);
      setButtonDisabled(false);
    }
  };

  return (
    <Container>
      <Left>
        <Logo src={LogoImage} />
        <Image src={AuthImage} />
      </Left>
      <Right>
        <div>
          <Title>Welcome to Wefit 45 👋</Title>
          <Span>Please login with your details here</Span>
        </div>
        <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
          <TextInput
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            handleChange={(e) => setPassword(e.target.value)}
          />
          <Button
            text="Sign In"
            onClick={handleSignIn}
            isLoading={loading}
            isDisabled={buttonDisabled}
          />
        </div>
        <Text>
          Don't have an account?{" "}
          <TextButton onClick={() => navigate("/signup")}>Sign Up</TextButton>
        </Text>
      </Right>
    </Container>
  );
};

export default SignIn;
