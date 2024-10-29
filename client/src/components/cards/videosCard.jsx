import React from "react";
import styled from "styled-components";

const Card = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
`;

const VideoTitle = styled.h3`
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

const VideoDescription = styled.p`
  color: ${({ theme }) => theme.text_secondary};
`;

const VideoLink = styled.a`
  display: block;
  margin-top: 8px;
  color: ${({ theme }) => theme.primary};
`;

const DeleteButton = styled.button`
  margin-top: 12px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
`;

const VideoCard = ({ video, onDelete }) => {
  return (
    <Card>
      <VideoTitle>{video.title}</VideoTitle>
      <VideoDescription>{video.description}</VideoDescription>
      <VideoLink href={video.videoLink} target="_blank">
        Watch Video
      </VideoLink>
      <DeleteButton onClick={() => onDelete(video._id)}>Delete</DeleteButton>
    </Card>
  );
};

export default VideoCard;
