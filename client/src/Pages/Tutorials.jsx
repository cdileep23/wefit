import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddVideo from "../components/cards/addVideo";
import Videos from "../components/cards/getVideos"; // Ensure you have this component
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // To handle redirects

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
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;
`;

const MainComponent = () => {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate(); // Use navigate to redirect

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

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/video/get-all", {
        withCredentials: true,
      });
      setVideos(response.data.videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = () => {
    fetchVideos(); // Call to fetch videos
  };

  useEffect(() => {
    checkUserToken(); // Check user authentication on component mount
    fetchVideos(); // Fetch videos on component mount
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        <Wrapper>
          <AddVideo refreshDashboard={refreshDashboard} buttonLoading={loading} />
          <Videos videos={videos} loading={loading} />
        </Wrapper>
      </Container>
    </>
  );
};

export default MainComponent;
