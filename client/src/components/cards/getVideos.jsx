import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Typography, TextField } from "@mui/material";
import VideoCard from "./videosCard"; // Ensure the correct casing here

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
`;

const SecTitle = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const deleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/video/remove-video/${videoId}`, {
        withCredentials: true,
      });
      setVideos(videos.filter(video => video._id !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Section>
      <SecTitle>All Videos</SecTitle>
      <TextField
        label="Search Videos"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
      />
      {loading ? (
        <Typography>Loading...</Typography>
      ) : filteredVideos.length > 0 ? (
        <CardWrapper>
          {filteredVideos.map((video) => (
            <VideoCard key={video._id} video={video} onDelete={deleteVideo} />
          ))}
        </CardWrapper>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No videos logged.
        </Typography>
      )}
    </Section>
  );
};

export default Videos;
