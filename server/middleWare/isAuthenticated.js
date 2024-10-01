import Jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Correctly access cookies via req.cookies
    const token = req.cookies.token;
    

    if (!token) {
      return res.status(401).json({ message: "User not Authenticated", success: false });
    }

    // Verify the token
    const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token", success: false });
    }

    // Set the decoded userId in req object
    req.userId = decoded.userId;

    // Continue to next middleware or route
    next();

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Authentication failed", success: false });
  }
};

export default isAuthenticated;
