import Video from "../models/videoModel.js"

// Function to add a video
export const addVideo = async (req, res) => {
  try {
    const { userId, title, description, videoLink } = req.body;

    // Check if a video with the same link already exists
    const existingVideo = await Video.findOne({ videoLink });
    if (existingVideo) {
      return res.status(400).json({ message: "Video with this link already exists", success: false });
    }

    // Create a new video
    const newVideo = new Video({
      user: userId,
      title,
      description,
      videoLink,
    });

    // Save the video to the database
    await newVideo.save();

    return res.status(201).json({ message: "Video added successfully", video: newVideo, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Function to remove a video by ID
export const removeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Find the video by ID and remove it
    const deletedVideo = await Video.findByIdAndDelete(videoId);
    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found", success: false });
    }

    return res.status(200).json({ message: "Video removed successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const getAllVideosByUser = async (req, res) => {
    try {
      const { userId } = req.body;
  
      const videos = await Video.find({ user: userId });
  
      return res.status(200).json({ videos, success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", success: false });
    }
  };
  