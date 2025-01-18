import express from 'express';
import { addgoalstoprojects, completegoal, createProject, createProjectwithImport, getprojects, getuserrepos } from '../controllers/projects.js';

const router = express.Router();

router.post('/createproj',createProject);  
router.post('/createprojimport',createProjectwithImport); 
router.post('/addgoal',addgoalstoprojects);
router.post('/compgoal',completegoal);
router.post('/getproj',getprojects);
router.post('/getrepos', getuserrepos);
export default router;
