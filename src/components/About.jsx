import React from "react";
import { Card, CardContent, CardMedia, Typography, Grid, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "../styles/about.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const features = [
  {
    title: "Accurate Forecasting",
    description:
      "AI-powered algorithms predict raw material demand, reducing wastage and stock-outs.",
    image: "https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg",
  },
  {
    title: "Real-time Inventory",
    description:
      "Track materials in real-time with automated updates and alerts for low stock.",
    image: "https://images.pexels.com/photos/373076/pexels-photo-373076.jpeg",
  },
  {
    title: "Supplier Management",
    description:
      "Maintain supplier info and track deliveries for a streamlined procurement process.",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
  },
  {
    title: "Analytics & Insights",
    description:
      "Visualize trends, monitor performance, and make data-driven decisions efficiently.",
    image: "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg",
  },
];

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero" style={{ 
        backgroundImage: "url('https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg')", 
        backgroundSize: "cover", 
        backgroundPosition: "center",
        color: "white",
        textAlign: "center",
        padding: "100px 20px",
        position: "relative"
      }}>
        <Box style={{backgroundColor: "rgba(0,0,0,0.5)", padding: "50px"}}>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>Raw Material Forecasting</h1>
          <p style={{ fontSize: "1.5rem", margin: "20px 0" }}>
            Optimizing inventory, reducing wastage, and forecasting demand for smarter operations
          </p>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/signup"
            size="large"
          >
            Get Started
          </Button>
        </Box>
      </section>

      {/* Features Section */}
      <section className="about-features" style={{ padding: "50px 20px", backgroundColor: "#f5f5f5" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>Key Features</h2>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                className="feature-card" 
                style={{ 
                  transition: "0.3s", 
                  cursor: "pointer",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0px 8px 15px rgba(0,0,0,0.2)"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0px)"}
              >
                <CardMedia
                  component="img"
                  height="150"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent style={{ textAlign: "center" }}>
                  <Typography variant="h6" style={{ fontWeight: "bold", color: "#3f51b5" }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </section>

      {/* Call to Action Section */}
      <section style={{ 
        padding: "60px 20px", 
        backgroundColor: "#3f51b5", 
        color: "white", 
        textAlign: "center" 
      }}>
        <h2 style={{ marginBottom: "20px" }}>Ready to optimize your operations?</h2>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/signup"
          size="large"
        >
          Get Started Now
        </Button>
      </section>

      {/* Footer */}
      <footer className="about-footer" style={{ padding: "20px", backgroundColor: "#222", color: "white", textAlign: "center" }}>
        <p>&copy; {new Date().getFullYear()} Raw Material Forecasting. All Rights Reserved.</p>
        <Box mt={1}>
          <FacebookIcon style={{ margin: "0 10px", cursor: "pointer" }} />
          <TwitterIcon style={{ margin: "0 10px", cursor: "pointer" }} />
          <LinkedInIcon style={{ margin: "0 10px", cursor: "pointer" }} />
        </Box>
      </footer>
    </div>
  );
};

export default About;
