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
  CircularProgress,
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
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RepoTreeDisplay from "./RepoStructure";
import RepoContents from "./RepoContentsDisplay";
import settings from "../assets/images/settings.png"
import DeleteProjectDialog from "./DeleteProjectDialog";
import { useSearchParams } from "react-router-dom";
const ProjectsPage = ({addnewprojectname, activityData,setActivityData,setShips,setTodaysShips,setTotalShips}) => {
  const [projects, setProjects] = useState([ ]);
  const [repoData, setRepoData] = useState(null);
  const [newGoal, setNewGoal] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedProjects, setCollapsedProjects] = useState([]);
  const [collapsedRepo, setCollapsedRepos] = useState([]);
  const theme = useTheme();
  const user=useSelector((state)=>state.user);
 
  const token=useSelector((state)=>state.token);
  const githubtoken=useSelector((state)=>state.githubtoken);
  const preferences=useSelector((state)=>state.preferences);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [createprojects,setcreateprojects]=useState(false); 
  const [addinggoal,setaddinggoal]=useState(-1);
  const [criteria,setcriteria]=useState(0);  
 const [loading,setloading]=useState(false);
 const [repoloading, setrepoloading]=useState(false);
 const [level,setlevel]=useState(0);
 const [deleteOpen, setDeleteOpen] = useState(false);
  const dispatch=useDispatch();
const [searchParams]=useSearchParams();


  const toggleCollapse = (projectId) => {
    setrepoloading(false);
    setCollapsedRepos((prev)=>({
      ...prev,
      [projectId]:false
    }))
    setRepoData(null);
    setCollapsedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };
  const toggleCollapseRepo = (projectId) => {
    if(collapsedRepo[projectId]===true){
      setRepoData(null);
      setrepoloading(false);
    }
    setCollapsedRepos((prev) => ({
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
  const difficultyLevels = [
    {
      name: "easy",
      backgroundColor: "#e0f2e9",  // Light green
      textColor: "#2e7d32"        // Medium-dark green
    },
    {
      name: "medium",
      backgroundColor: "#fff3e0",  // Light orange
      textColor: "#ed6c02"        // Medium-dark orange
    },
    {
      name: "hard",
      backgroundColor: "#feecec",  // Light red
      textColor: "#d32f2f"        // Medium-dark red
    }
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
   
    // console.log(newGoal.diff)
    const data={userid:user.id, text:newGoal.text, projectid:newGoal.projectid, diff:level};
    console.log(JSON.stringify(data))
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
    console.log(projects);
    try {
      const response=await fetch('http://localhost:3000/projects/addgoal',{
        method:"POST",
        body:JSON.stringify(data),
        headers:{"Content-Type":"application/json"}
      });
      const addedgoal=await response.json();
      setNewGoal({userid:null,text:null,projectid:null, diff:null});
    } catch (error) {
      
    }
  }

  

  useEffect(()=>{
    const getprojects=async()=>{
      
      const data={userid:user.id, githubusername:user.username, githubToken:githubtoken};
      setloading(true);
      const response=await fetch('http://localhost:3000/projects/getproj',{
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
     if (searchParams.get("from") === "extension" ) {
      let repo=searchParams.get("repo");
      const projfind=sortedProjects.find((project)=>project.repoName===repo);
      
      if(projfind?.repoName){
        setCollapsedProjects((prev) => ({
          ...prev,
          [projfind._id]: true,
        }));
      }else
     { console.log('working');
      setcreateprojects(true)
    }
      
    }
  }
    getprojects();
  },[])

  const handlechange=(e,projectid)=>{
   
    setNewGoal({projectid:projectid,text:e.target.value});
  
  }

  
  const completegoal=async(goal,projectid, projectname)=>{
    const text=goal.text;
    const data={userid:user.id,projectid,text:goal.text, diff:goal.diff};
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
      const response=await fetch('http://localhost:3000/projects/compgoal',{
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

  const fetchRepoStructure = async (repoName) => {
    setrepoloading(true);
   try {
      const response = await fetch(`http://localhost:3000/projects/getrepostruct`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          owner:user.username,
          repo:repoName,
          accessToken:githubtoken
        })
      });
      const response2 = await fetch(`http://localhost:3000/projects/getrepocontents`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          username:user.username,
          repoName:repoName,
          accessToken:githubtoken
        })
      });
      const data2=await response2.json();
      const data = await response.json();
      setrepoloading(false);
     // console.log(data)
      if (data && data2) {
        // Transform the flat file structure into a tree
        //const tree = transformToTree(data);
        setRepoData({data:data, name:repoName, contents:data2.data});
      } else {
        setError(data);
      }
    } catch (err) {
      
    } 
  };

 return (
    <Box
      sx={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        fontFamily: "K2D",
        paddingTop: 10,
        width:isSmallScreen ?"100%":"70%", 
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
            width: isSmallScreen ? "100%" : "40%",
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
            width: isSmallScreen ? "100%" : "40%",
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
                   `last commit: ${project.latestCommit.length > 15 ? 
                   project.latestCommit.slice(0, 15) + "..." : 
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
                        gap:1,
                       
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
                        InputProps={{
                          endAdornment: (
                            <Button
                              sx={{
                                backgroundColor: difficultyLevels[level].backgroundColor,
                                color: difficultyLevels[level].textColor,
                                fontWeight: 700,
                                fontSize: 12,
                                fontFamily: "K2D",
                                height: 28,  // Slightly reduced height to fit inside TextField
                                pl:1,
                                minWidth: 'fit-content',
                                mr: -1,     // Negative margin to adjust position
                                '&:hover': {
                                  backgroundColor: difficultyLevels[level].backgroundColor,
                                }
                              }}
                              onClick={() => {
                                setlevel((prev) => (prev + 1) % 3);
                              }}
                            >
                              {difficultyLevels[level].name}
                            </Button>
                          )
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
                          alignItems: "stretch",
                          justifyContent: "space-between",
                          //padding: "10px",
                          backgroundColor: "#292929",
                          borderRadius: "5px",
                          marginBottom: 0.5,
                          //height:60,
                          minHeight:60,
                          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'
                        }}
                      >
                        <Box sx={{ display: 'flex',
     flexDirection: 'row',
     alignItems: 'center',
     padding: '10px 0',
     
     flex: 1,
     minWidth: 0}}>
                         {goal.diff && (
 <Box 
   sx={{
     width: '12px',
     height: '12px',
     borderRadius: '50%',
     backgroundColor: difficultyLevels[goal.diff].textColor,
     flexShrink: 0,
     ml:1
   }}
 />
)}
                        <Typography
                          sx={{   fontFamily: "K2D",
                            fontSize: "17px",
                            marginLeft: "10px",
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word'}}
                        >
                          {goal.text}
                        </Typography>
                       </Box>
                        <Button
                          onClick={() => completegoal(goal,project._id, project.projectName)}
                          sx={{
                            color: "white",
                            backgroundColor: "#50C878",
                            minHeight:'100%',
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
                     {project.repoName && (
                      <Box sx={{padding:1}}>
                        <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <Box sx={{display:'flex', flexDirection:'row'}}>
                        <Typography sx={{color:'white', fontFamily:'k2d', fontSize:15}} onClick={()=>toggleCollapseRepo(project._id)}>repository details</Typography>
                        {collapsedRepo[project._id] ? (
                    <KeyboardArrowDownIcon sx={{ color: "white" }} />
                  ) : (
                    <KeyboardArrowRightIcon sx={{ color: "white" }} />
                  )}
                 
                  </Box>
                  {/* <IconButton sx={{display:'flex', flexDirection:'row'}} onClick={()=>{setDeleteOpen(project); }}>
                        <img src={settings} style={{width:20, height:20}}/>
                  </IconButton> */}
                        </Box>
                     
                       <Collapse in={collapsedRepo[project._id]}>
                       <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', marginTop:1}}>
                      <Button startIcon={<GitHubIcon sx={{color:'white'}}/>} 
                     sx={{ textTransform: 'none' }} 
                     onClick={() => window.open(`https://github.com/${user.username}/${project.repoName}`, '_blank')}>
                     <Typography sx={{fontFamily:'k2d', color:'white', fontSize:15}}>{project.repoName}</Typography>
                    </Button>
                    <Button sx={{ textTransform: 'none', backgroundColor:'lightgrey' }} onClick={()=>{if(!repoloading)fetchRepoStructure(project.repoName)}}>
                     {!repoloading?<Typography sx={{fontFamily:'k2d', color:'black', fontSize:15, fontWeight:'bold'}}>browse repo</Typography>:
                     <CircularProgress size={20} color='black'/>}
                    </Button>
                    </Box>
                    {repoData?.data.length>0 && repoData?.name && <RepoTreeDisplay files={repoData.data} repoName={repoData.name} contents={repoData.contents}/>}
                    {repoData?.contents && <RepoContents contents={repoData.contents}/>}
                    {repoData?.data.length===0 && <Typography sx={{color:'white', fontFamily:'k2d'}}>seems your repo is empty</Typography>}
                    </Collapse>
                    </Box>
                    )}

                  </Box>
                </Collapse>
                <DeleteProjectDialog
  project={deleteOpen}
  open={Boolean(deleteOpen)}
  onClose={() => setDeleteOpen(null)}
  onDelete={()=>{console.log('hello')}}
/>
              </Box>
            ) : (
                <Box
        sx={{
          backgroundColor: "#1e1e1e",
          borderRadius: "10px",
          padding: 0.5,
          boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)",
          width: "100%", // Ensure box takes full width of grid item
          minWidth: "350px", // Add maximum width to prevent excessive stretching
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
                    paddingLeft:1,
                    
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
           sx={{
            backgroundColor: difficultyLevels[level].backgroundColor,  // Light green background
            color: difficultyLevels[level].textColor,           // Darker green text
            fontWeight: 700,
            fontSize: 12,
            fontFamily: "K2D",
            height: 35,
            borderRadius:5,
            
          }}
          onClick={()=>{
            setlevel((prev)=>(prev+1)%3);
          }}
        >
          {difficultyLevels[level].name}
        </Button>
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
                          sx={{ fontFamily: "K2D", fontSize: "17px", marginLeft: "10px", flexGrow:1}}
                        >
                          {goal.text}
                        </Typography>
                        {goal.diff  && <Typography
 sx={{
   backgroundColor: difficultyLevels[goal.diff].backgroundColor,
   color: difficultyLevels[goal.diff].textColor,
   fontWeight: 700,
   padding: '2px 6px',
   borderRadius: 2,
   mr:1,
   fontFamily:'k2d'
 }}
>
 {difficultyLevels[goal.diff].name} 
</Typography>}
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
                    {project.repoName && (
                      <Box sx={{padding:1}}>
                         <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <Box sx={{display:'flex', flexDirection:'row', cursor:'pointer'}}>
                        <Typography sx={{color:'white', fontFamily:'k2d', fontSize:15}} onClick={()=>toggleCollapseRepo(project._id)}>repository details</Typography>
                        {collapsedRepo[project._id] ? (
                    <KeyboardArrowDownIcon sx={{ color: "white" }} />
                  ) : (
                    <KeyboardArrowRightIcon sx={{ color: "white" }} />
                  )}
                  </Box>
                  {/* <IconButton sx={{display:'flex', flexDirection:'row'}} onClick={()=>{setDeleteOpen(project); }}>
                        <img src={settings} style={{width:20, height:20}}/>
                  </IconButton> */}
                        </Box>
                       <Collapse in={collapsedRepo[project._id]}>
                       <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', marginTop:1}}>
                      <Button startIcon={<GitHubIcon sx={{color:'white'}}/>} 
                     sx={{ textTransform: 'none' }} 
                     onClick={() => window.open(`https://github.com/${user.username}/${project.repoName}`, '_blank')}>
                     <Typography sx={{fontFamily:'k2d', color:'white', fontSize:15}}>{project.repoName}</Typography>
                    </Button>
                    <Button sx={{ textTransform: 'none', backgroundColor:'lightgrey' }} onClick={()=>{if(!repoloading)fetchRepoStructure(project.repoName)}}>
                    {!repoloading?<Typography sx={{fontFamily:'k2d', color:'black', fontSize:15, fontWeight:'bold'}}>browse repo</Typography>:
                     <CircularProgress size={20} color='black'/>}
                    </Button>
                    </Box>
                    {repoData?.data.length>0 && repoData?.name && <RepoTreeDisplay files={repoData.data} repoName={repoData.name} contents={repoData.contents}/>}
                    {repoData?.contents && <RepoContents contents={repoData.contents}/>}
                    {repoData?.data.length===0 && <Typography sx={{color:'white', fontFamily:'k2d'}}>seems your repo is empty</Typography>}
                    </Collapse>
                    </Box>
                    )}

                  
                  </Box>
                </Collapse>
                <DeleteProjectDialog
  project={deleteOpen}
  open={Boolean(deleteOpen)}
  onClose={() => setDeleteOpen(null)}
  onDelete={()=>{console.log('hello')}}
/>
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
