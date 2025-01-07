import Ship from '../models/Ship.js';  // Assuming your Ship model is in the 'models' directory
import User from '../models/User.js';  // Assuming your User model is in the 'models' directory
import { getShipsPerDay, getTodaysShips, getTotalShips } from '../services/ship.js';

// Save a new ship for a user
export const saveShip = async (req, res) => {
  try {
    const { userId, title } = req.body;  // Get userId and title from the request body

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new ship document
    const newShip = new Ship({
      userId,
      title,
      //createdAt: new Date(),
    });

    // Save the new ship
    await newShip.save();

    // Return the newly created ship
    res.status(201).json(newShip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Edit an existing ship
export const editShip = async (req, res) => {
  try {
    const { id } = req.params;  // Get the ship id from the URL
    const { title } = req.body;  // Get updated title from the request body
    //console.log(req.body);
    // Find the ship by ID
    const ship = await Ship.findById(id);
    if (!ship) {
      return res.status(404).json({ message: 'Ship not found' });
    }

    // Update the ship title
    if (title) ship.title = title;

    // Save the updated ship
    await ship.save();

    // Return the updated ship
    res.status(200).json(ship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a ship
export const deleteShip = async (req, res) => {
  try {
    const { id } = req.params;  // Get the ship id from the URL

    // Find the ship by ID and delete it
    const ship = await Ship.findByIdAndDelete(id);
    if (!ship) {
      return res.status(404).json({ message: 'Ship not found' });
    }

    // Return a success message
    res.status(200).json({ message: 'Ship deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all ships of a particular user
export const getShips = async (req, res) => {
  try {
    const { userId } = req.params;  // Get userId from the URL params
    
    // Find all ships for the given user
    const ships = await Ship.find({ userId }).sort({ createdAt: -1 }); // Sort by creation date, descending order
    
    const [todaysShips, totalShips, shipsPerDay] = await Promise.all([
      getTodaysShips(userId),
      getTotalShips(userId),
      getShipsPerDay(userId),
    ]);
    //console.log(shipsPerDay)

    res.status(200).json({ ships,todaysShips, totalShips, shipsPerDay });
  

    // Return the list of ships
    //res.status(200).json(ships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getShipStats = async (req, res) => {
  try {
    const { userId } = req.params;  // Get userId from the URL params

    const [todaysShips, totalShips, shipsPerDay] = await Promise.all([
      getTodaysShips(userId),
      getTotalShips(userId),
      getShipsPerDay(userId),
    ]);
    //console.log(todaysShips);

    res.status(200).json({ todaysShips, totalShips, shipsPerDay });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve ship stats', error: error.message });
  }
};

