import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
  Collapse,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ProjectSetupModal from "../modals/CreateProjects";
import { useDispatch, useSelector } from "react-redux";
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import goalIcon from "../assets/images/goal.png";
import filterIcon from "../assets/images/filter.png";
import { setGithubLogin, setLogin } from "../state";
import noprojIcon from "../assets/images/startup.png";
import CreateRepoLoader from "./CreateRepoLoader";
import ProjectsLoader from "./ProjectsLoader";
import GitHubIcon from '@mui/icons-material/GitHub';
const ProjectsPage = ({addnewprojectname, activityData,setActivityData,setShips,setTodaysShips,setTotalShips}) => {
  const [projects, setProjects] = useState([ ]);
  const [newGoal, setNewGoal] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedProjects, setCollapsedProjects] = useState([]);
  const theme = useTheme();
  const user=useSelector((state)=>state.user);
  console.log(user)
  const token=useSelector((state)=>state.token);
  const githubtoken=useSelector((state)=>state.githubtoken);
  const preferences=useSelector((state)=>state.preferences);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [createprojects,setcreateprojects]=useState(false); 
  const [addinggoal,setaddinggoal]=useState(-1);
  const [criteria,setcriteria]=useState(0);  
 const [loading,setloading]=useState(false);
  const dispatch=useDispatch();
  const toggleCollapse = (projectId) => {
    setCollapsedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const projectSortingCriteria = [
   
   "Most Recent Commits" ,
   "Highest Unachieved Goals" ,
  "Oldest Projects" ,
   "Newest Projects" 
  ];

  const handlecriteriachange=()=>{
    const newcriteria=(criteria+1)%4;
    //console.log(newcriteria)
    setcriteria(newcriteria);
    //console.log(criteria);
    reorderproj(newcriteria);
  }

  const reorderproj=(criteria)=>{
    //console.log("starting=",criteria)
   
    let reorderedProjects = [...projects]; // Create a copy to avoid mutating the original array
    
    //console.log("changed to=",criteria);
  
    switch (criteria) {
      case 0: // Most Recent Commits
        reorderedProjects.sort((a, b) => new Date(a.latestCommitDate) - new Date(b.latestCommitDate));
        //console.log(criteria, "commit");
        break;
  
      case 1: // Most Goals Achieved
        reorderedProjects.sort((a, b) => b.goals.length - a.goals.length);
        break;
  
      case 2: // Oldest Projects
        reorderedProjects.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
  
      case 3: // Newest Projects
        reorderedProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
  
      default:
        return; // Do nothing if invalid criteria
    }
  
    setProjects(reorderedProjects);

  }

  const deleteGoal = (projectId, goalIndex) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project._id === projectId
          ? {
              ...project,
              goals: project.goals?.filter((_, index) => index !== goalIndex),
            }
          : project
      )
    );
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addprojects=(project)=>{
    setProjects((prev)=>[project,...prev]);
  }

  const addgoal=async()=>{
   
    const data={userid:user.id, text:newGoal.text, projectid:newGoal.projectid};
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project._id === newGoal.projectid
          ? {
              ...project,
              goals: [...project.goals,data],
            }
          : project
      )
    );
   setNewGoal({userid:null,text:null,projectid:null});
    try {
      const response=await fetch('https://buildstack.onrender.com/projects/addgoal',{
        method:"POST",
        body:JSON.stringify(data),
        headers:{"Content-Type":"application/json"}
      });
      const addedgoal=await response.json();

    } catch (error) {
      
    }
  }

  

  useEffect(()=>{
    const getprojects=async()=>{
      const data={userid:user.id, githubusername:user.username, githubToken:githubtoken};
      setloading(true);
      const response=await fetch('https://buildstack.onrender.com/projects/getproj',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      });
      const returneddata=await response.json();
      
      const sortedProjects = returneddata.sort((a, b) => {
        const dateA = new Date(a.latestCommitDate || 0); // Fallback to 0 if missing
        const dateB = new Date(b.latestCommitDate || 0);
        return dateB - dateA; // Sort descending (most recent first)
      });
    
     setProjects(sortedProjects);
     setloading(false);
  }
    getprojects();
  },[])

  const handlechange=(e,projectid)=>{
   
    setNewGoal({projectid:projectid,text:e.target.value});
    console.log(newGoal)
  }

  const modifyMainPage=()=>{

  }

  const completegoal=async(goal,projectid, projectname)=>{
    const text=goal.text;
    const data={userid:user.id,projectid,text:goal.text};
    try {
      setProjects(prevProjects => 
        prevProjects.map(project => {
            if (project._id === projectid) {
                return {
                    ...project,
                    goals: project.goals.filter(goal => goal.text !== text)
                };
            }
            return project;
        })
    );
      const response=await fetch('https://buildstack.onrender.com/projects/compgoal',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      });
      const returneddata=await response.json();
      addnewprojectname(projectname)
      setShips((prevState) => ({
        ...prevState, // Keep all other attributes unchanged
        ships: [returneddata.ship,...prevState.ships], // Update the `ships` array
      }));
     
      setTodaysShips((prev)=>prev+1);
      setTotalShips((prev)=>prev+1);
      const createdAtDate = new Date(returneddata.ship.createdAt);
      const dateString = createdAtDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Find the index of the date in activityData
      const index = activityData.findIndex((data) => data.date === dateString);

      // If the date exists, increment the value
      if (index !== -1) {
        const updatedData = [...activityData];
        updatedData[index].value += 1;
        setActivityData(updatedData); // Update the state
      }
    } catch (error) {
      console.log(error);
    }
  }

 return (
    <Box
      sx={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        fontFamily: "K2D",
        paddingTop: 10,
        width:isSmallScreen ?"100%":"50%", 
      }}
    >
      <Typography sx={{fontFamily:'k2d', textAlign:'center', fontSize:!isSmallScreen?70:40, marginBottom:3}}>
        my projects
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection:'column',
          marginBottom: "20px",
          gap: 1,
        }}
      >
     
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            backgroundColor: "white",
            color: "black",
            fontWeight: 700,
            fontSize: 12,
            fontFamily: "K2D",
            "&:hover": {
              backgroundColor: "gray",
            },
            height:35,
            borderRadius:2,
            alignItems:'center',
          }}
          onClick={()=>{setcreateprojects(true)}}
        >
          New Project
        </Button>
        
        <TextField
          variant="outlined"
          placeholder="Search Projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
          sx={{
            width: isSmallScreen ? "100%" : "50%",
            backgroundColor: "white",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              padding: "4px", // Adjust padding to reduce height
            },
            input: { fontFamily: "monospace",
                            fontWeight: "bold",
                            fontSize: "14px",  // You can adjust this value
                            color: "black",    // This sets the input text color
                "&::placeholder": {
                     opacity:0.6,
                     fontWeight:"bold",
                     fontFamily:"monospace"
                   }},
            "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "transparent"  // Makes the outline transparent
                            },
                            "&:hover fieldset": {
                              borderColor: "transparent"  // Keeps outline transparent on hover
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "transparent"  // Keeps outline transparent when focused
                            }
                          }
          }}
          InputProps={{
            sx: {
              height: "36px", // Set a fixed height
            },
          }}
        />
        <Button
          variant="contained"
          //startIcon={<AddCircleOutlineIcon />}
          sx={{
            backgroundColor: "white",
            width: isSmallScreen ? "100%" : "50%",
            color: "black",
            fontWeight: 700,
            fontSize: 12,
            fontFamily: "K2D",
            "&:hover": {
              backgroundColor: "gray",
            },
            height:35,
            borderRadius:2,
            justifyContent:'flex-start',
            //width:'100%'
          }}
          onClick={handlecriteriachange}
        >
          <img src={filterIcon} width={20} height={20} style={{marginRight:10}}/>
          {projectSortingCriteria[criteria]}
        </Button>
      </Box>
      {filteredProjects.length===0 && !loading && (
        <Box sx={{display:'flex', flexDirection:!isSmallScreen?'row':'column', mt:2, alignItems:'center', justifyContent:'center', mt:10}}>
          <img src={noprojIcon} style={{width:100, height:100, marginBottom:isSmallScreen && 20}}/>
          <Typography sx={{fontFamily:'k2d', ml:2, fontSize:20}}>get started by creating your first project</Typography>
        </Box>
      )}
      {loading && (
        <Box sx={{mt:10}}>
        <ProjectsLoader/>
        </Box>
      )}
      <Grid
        container
        spacing={3}
        sx={{
          flexDirection: isSmallScreen ? "column" : "row",
        }}
      >
        {filteredProjects.map((project) => (
          <Grid item xs={12} sm={12} md={6} key={project._id}>
            {isSmallScreen ? (
              <Box
                sx={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: "10px",
                  padding: 0.5,
                  boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)",
                  
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    marginBottom:1,
                    paddingLeft:1
                  }}
                  onClick={() => toggleCollapse(project._id)}
                >
                  <Box sx={{display:'flex', flexDirection:'column'}}>
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: "10px",
                      fontFamily: "K2D",
                      display: "inline-block",
                    }}
                  >
                    {project.projectName}
                  </Typography>
                  
                  <Typography
                    sx={{
                      //marginBottom: "10px",
                      fontFamily: "K2D",
                      //display: "inline-block",
                      fontSize:16
                    }}
                  >
                    {project.latestCommit ?
                   `last commit: ${project.latestCommit.length > 25 ? 
                   project.latestCommit.slice(0, 25) + "..." : 
                   project.latestCommit}` : `no commits yet`}
                  </Typography>
                  </Box>
                  <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography
                    sx={{
                     // marginBottom: "10px",
                      fontFamily: "K2D",
                      //display: "inline-block",
                      fontSize:40
                    }}
                  >
                    <img src={goalIcon} width={30} height={30} style={{marginRight:1}}/>
                    {project.goals?.length>0?`${project.goals?.length}  `:`0`}
                  </Typography>
                  
                  {collapsedProjects[project._id] ? (
                    <ExpandLessIcon sx={{ color: "white" }} />
                  ) : (
                    <ExpandMoreIcon sx={{ color: "white" }} />
                  )}
                  </Box>
                </Box>
                <Collapse in={collapsedProjects[project._id]}>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 1,
                        gap:1
                      }}
                    >
                      <TextField
                        variant="outlined"
                        placeholder="Add a goal"
                      
                        value={newGoal.projectid===project._id ?newGoal.text:''}
                        onChange={(e)=>{handlechange(e,project._id)}}
                        size="small"
                        autoComplete="off"
                        sx={{
                          flexGrow: 1,
                          backgroundColor: "#8a8a8a",
                          borderRadius: "5px",
                          input: {
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            fontSize: "14px",  // You can adjust this value
                            color: "black",    // This sets the input text color
                            "&::placeholder": {
                              color: "black",
                              fontWeight: "bold",
                              fontFamily: "monospace"
                            },
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "transparent"  // Makes the outline transparent
                            },
                            "&:hover fieldset": {
                              borderColor: "transparent"  // Keeps outline transparent on hover
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "transparent"  // Keeps outline transparent when focused
                            }
                          }
                        }}
                        
                      />
                      <Button
          variant="contained"
         
          sx={{
            backgroundColor: "#8a8a8a",
            color: "black",
            fontWeight: 700,
            fontSize: 12,
            fontFamily: "K2D",
            height:35,
            "&:hover": {
              backgroundColor: "gray",
            },

          }}
          onClick={()=>{
            if(newGoal.projectid===project._id)
            addgoal();}}
        >
          Save
        </Button>
                    </Box>
                    {project.goals?.map((goal, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          //padding: "10px",
                          backgroundColor: "#292929",
                          borderRadius: "5px",
                          marginBottom: 0.5,
                          height:60,
                          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'
                        }}
                      >
                        <Typography
                          sx={{ fontFamily: "K2D", fontSize: "17px",marginLeft:"10px" }}
                        >
                          {goal.text}
                        </Typography>
                        <Button
                          onClick={() => completegoal(goal,project._id, project.projectName)}
                          sx={{
                            color: "white",
                            backgroundColor: "#50C878",
                            height:'100%',
                            borderRadius:0,
                            borderTopRightRadius:"5px",
                            borderBottomRightRadius:"5px",  
                            //"&:hover": { color: "red" },
                          }}
                        >
                          <DoneAllIcon />
                        </Button>
                      </Box>
                    ))}
                      {project.repoName && <Button startIcon={<GitHubIcon sx={{color:'white'}}/>} 
                     sx={{ textTransform: 'none' }}
                     onClick={() => window.open(`https://github.com/${user.username}/${project.repoName}`, '_blank')} >
                     <Typography sx={{fontFamily:'k2d', color:'white', fontSize:15}}>{project.repoName}</Typography>
                    </Button>}
                  </Box>
                </Collapse>
              </Box>
            ) : (
                <Box
        sx={{
          backgroundColor: "#1e1e1e",
          borderRadius: "10px",
          padding: 0.5,
          boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)",
          width: "100%", // Ensure box takes full width of grid item
          minWidth: "300px", // Add maximum width to prevent excessive stretching
          overflowY:'auto',
          '&::-webkit-scrollbar': {
            width: '3px', // Width of the scrollbar
          },
          '&::-webkit-scrollbar-track': {
            background: '#1e1e1e', // Track background color
            borderRadius: '3px', // Track rounded corners
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(145deg, #444, #888)', // Thumb gradient
            borderRadius: '3px', // Thumb rounded corners
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(145deg, #666, #aaa)', // Hover effect on thumb
          },
        }}
      >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    paddingLeft:1
                  }}
                  onClick={() => toggleCollapse(project._id)}
                >
                  <Box sx={{display:'flex', flexDirection:'column'}}>
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: "5px",
                      fontFamily: "K2D",
                      display: "inline-block",
                    }}
                  >
                    {project.projectName}
                  </Typography>
                  
                  <Typography
                    sx={{
                      //marginBottom: "10px",
                      fontFamily: "K2D",
                      //display: "inline-block",
                      fontSize:14
                    }}
                  >
                  {project.latestCommit ?
                   `last commit: ${project.latestCommit.length > 25 ? 
                   project.latestCommit.slice(0, 25) + "..." : 
                   project.latestCommit}` : `no commits yet`}
                  </Typography>
                  </Box>
                  <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography
                    sx={{
                     // marginBottom: "10px",
                      fontFamily: "K2D",
                      //display: "inline-block",
                      fontSize:35
                    }}
                  >
                    <img src={goalIcon} width={25} height={25} style={{marginRight:2}}/>
                   {project.goals?.length>0?`${project.goals?.length}  `:`0`}
                  </Typography>
                
                  {collapsedProjects[project._id] ? (
                    <ExpandLessIcon sx={{ color: "white" }} />
                  ) : (
                    <ExpandMoreIcon sx={{ color: "white" }} />
                  )}
                  </Box>
                </Box>
                <Collapse in={collapsedProjects[project._id]}>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 1,
                        gap:1
                      }}
                    >
                      <TextField
                        variant="outlined"
                        placeholder="Add a goal"
                        autoComplete="off"
                        value={newGoal.projectid===project._id ?newGoal.text:''}
                        onChange={(e) =>{ handlechange(e,project._id) }}
                        size="small"
                        sx={{
                          flexGrow: 1,
                          backgroundColor: "#8a8a8a",
                          borderRadius: "5px",
                          input: {
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            fontSize: "14px",  // You can adjust this value
                            color: "black",    // This sets the input text color
                            "&::placeholder": {
                              color: "black",
                              fontWeight: "bold",
                              fontFamily: "monospace"
                            },
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "transparent"  // Makes the outline transparent
                            },
                            "&:hover fieldset": {
                              borderColor: "transparent"  // Keeps outline transparent on hover
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "transparent"  // Keeps outline transparent when focused
                            }
                          }
                        }}
                      />
                        <Button
          //variant="contained"
          //startIcon={<AddCircleOutlineIcon />}
          sx={{
            backgroundColor: "#8a8a8a",
            color: "black",
            fontWeight: 700,
            fontSize: 12,
            fontFamily: "K2D",
            height:35,
            "&:hover": {
              backgroundColor: "gray",
            },
          }}
          onClick={()=>{
            if(newGoal.projectid===project._id)
            addgoal();}}
        >
          Save
        </Button>
                    </Box>
                    {project.goals?.map((goal, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#292929",
                          borderRadius: "5px",
                          marginBottom: 0.5,
                          height: 60,
                          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'
                        }}
                      >
                        <Typography
                          sx={{ fontFamily: "K2D", fontSize: "17px", marginLeft: "10px" }}
                        >
                          {goal.text}
                        </Typography>
                        <Button
                          onClick={() => completegoal(goal,project._id, project.projectName)}
                          sx={{
                            color: "white",
                            backgroundColor: "#50C878",
                            height: '100%',
                            borderRadius: 0,
                            borderTopRightRadius: "5px",
                            borderBottomRightRadius: "5px",
                          }}
                        >
                          <DoneAllIcon />
                        </Button>
                      </Box>
                    ))}
                    {project.repoName && <Button startIcon={<GitHubIcon sx={{color:'white'}}/>} 
                     sx={{ textTransform: 'none' }} 
                     onClick={() => window.open(`https://github.com/${user.username}/${project.repoName}`, '_blank')}>
                     <Typography sx={{fontFamily:'k2d', color:'white', fontSize:12}}>{project.repoName}</Typography>
                    </Button>}
                  </Box>
                </Collapse>
              </Box>
            )}
          </Grid>
        ))}
      </Grid>
      <ProjectSetupModal open={createprojects} onClose={()=>{setcreateprojects(false)}} addprojects={addprojects} projects={projects}/>
    </Box>
  );
};

export default ProjectsPage;
