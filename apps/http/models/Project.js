// Importing Mongoose
import mongoose from 'mongoose';

// Define the Schema
const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true,
  },
  repoName: {
    type: String,
    required: true,
    trim: true,
  },
  repoType: {
    type: String,
   // enum: ['Public', 'Private'], // Restricts values to "Public" or "Private"
    required: true,
  },
  githubRepoId: {
    type: String,
    required: true,
    unique: true, // Ensures the ID is unique
  },
  githubRepoUrl: {
    type: String,
    required: true,
    
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assumes a "User" schema exists
    required: true,
  },
  goals:[
    {
      addedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
      },
      text:{type:String},
      diff:{type:String}
      
    }
  ]
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

// Export the Model
const Project = mongoose.model('Project', projectSchema);
export default Project;
