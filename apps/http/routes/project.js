import express from 'express';
import { addgoalstoprojects, completegoal, createProject, createProjectwithImport, deleteProject, getFormattedRepoContents, getprojects, getrepostruct, getuserrepos } from '../controllers/projects.js';

const router = express.Router();

router.post('/createproj',createProject);  
router.post('/createprojimport',createProjectwithImport); 
router.post('/addgoal',addgoalstoprojects);
router.post('/compgoal',completegoal);
router.post('/getproj',getprojects);
router.post('/getrepos', getuserrepos);

router.post('/getrepostruct', getrepostruct);
router.post('/getrepocontents', getFormattedRepoContents);
router.post('/delete',deleteProject);
export default router;
