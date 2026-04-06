import DashboardData from "../models/DashboardData.js";

// Store dashboard data
export const storeDashboardData = async (req, res) => {
  try {
    const { dashboardData } = req.body;

    if (!dashboardData || !dashboardData.length) {
      return res.status(400).json({ message: "No dashboard data provided" });
    }

    // Optional: Remove old data if you want only latest snapshot
    // await DashboardData.deleteMany({});

    // Save new data
    const savedData = await DashboardData.insertMany(dashboardData);
    res.status(201).json({ message: "Dashboard data stored successfully", data: savedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while storing dashboard data" });
  }
};

// Get dashboard data (optional)
export const getDashboardData = async (req, res) => {
  try {
    const data = await DashboardData.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching dashboard data" });
  }
};
