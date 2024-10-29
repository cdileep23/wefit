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

const AddVideo = ({ refreshDashboard, buttonLoading }) => {
  const [videoDetails, setVideoDetails] = useState({
    title: "",
    description: "",
    videoLink: "",
  });

  const handleChange = (e) => {
    setVideoDetails({
      ...videoDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddVideo = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/video/add-video",
        {
          title: videoDetails.title,
          description: videoDetails.description,
          videoLink: videoDetails.videoLink,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log(response.data);
        // Fetch all videos again
        refreshDashboard();

        // Reset video details after successful addition
        setVideoDetails({
          title: "",
          description: "",
          videoLink: "",
        });
      } else {
        console.error("Failed to add video:", response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error while adding video:", error);
    }
  };

  return (
    <Card>
      <Title>Add Video</Title>
      <Input
        type="text"
        name="title"
        placeholder="Video Title"
        value={videoDetails.title}
        onChange={handleChange}
      />
      <Input
        type="text"
        name="description"
        placeholder="Description"
        value={videoDetails.description}
        onChange={handleChange}
      />
      <Input
        type="url"
        name="videoLink"
        placeholder="Video Link"
        value={videoDetails.videoLink}
        onChange={handleChange}
      />
      <Button onClick={handleAddVideo} disabled={buttonLoading}>
        {buttonLoading ? "Adding..." : "Add Video"}
      </Button>
    </Card>
  );
};

export default AddVideo;
