import Ship from '../models/Ship.js';
import moment from 'moment'; // For date manipulation
import mongoose from 'mongoose';
export const getTodaysShips = async (userId) => {
  const startOfDay = moment().startOf('day').toDate();
  const endOfDay = moment().endOf('day').toDate();

  return await Ship.countDocuments({
    userId,
    createdAt: { $gte: startOfDay, $lt: endOfDay },
  });
};

export const getTotalShips = async (userId) => {
    return await Ship.countDocuments({ userId });
  };

 export const getShipsPerDay = async (userId) => {
    try {
      // Fetch ship data for the specified user
      const ships = await Ship.find({ userId });
  
      // Create a Map to count ships per day
      const shipCounts = new Map();
  
      ships.forEach((ship) => {
        // Convert timestamp to a Date object
        const date = new Date(ship.createdAt);
        // Format the date as "MMM D" (e.g., "Jan 2")
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
  
        // Increment count for the specific date
        shipCounts.set(formattedDate, (shipCounts.get(formattedDate) || 0) + 1);
      });
  
      // Generate activity data for the past 14 days
      const activityData = [];
      const now = new Date();
      for (let i = 13; i >= 0; i--) {
        const currentDate = new Date(now);
        currentDate.setDate(now.getDate() - i);
  
        const formattedDate = currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
  
        activityData.push({
          date: formattedDate,
          value: shipCounts.get(formattedDate) || 0,
        });
      }
  
      return activityData;
    } catch (error) {
      console.error("Error fetching ships:", error);
      throw new Error("Could not retrieve ship data.");
    }
  };
  