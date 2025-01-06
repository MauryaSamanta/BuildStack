import express from 'express';
import {
  saveShip,
  editShip,
  deleteShip,
  getShips,
} from '../controllers/ship.js';

const router = express.Router();

// Route to save a new ship
router.post('/save', saveShip);

// Route to edit an existing ship
router.put('/edit/:id', editShip); // Requires `id` as a parameter to identify the ship

// Route to delete a ship
router.delete('/delete/:id', deleteShip); // Requires `id` as a parameter to identify the ship

// Route to get all ships for a user
router.get('/getships/:userId', getShips);


export default router;
