import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import CreateRepoLoader from "../components/CreateRepoLoader";
import GitHubIcon from '@mui/icons-material/GitHub';
import norepoIcon from "../assets/images/no-results.png"
const ProjectSetupModal = ({ open, onClose, addprojects, projects }) => {
  const [projectName, setProjectName] = useState("");
  const [repoName, setRepoName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const user = useSelector((state) => state.user);
  const githubtoken = useSelector((state) => state.githubtoken);
  const [loading, setloading] = useState(false);
  const [selectedrepo,setselectedrepo]=useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [repos,setrepos]=useState([]);
  const [projectexist,setprojectexist]=useState(false);
  const [reponametaken,setreponametaken]=useState(false);
  const checkProjectExists = (projects, projectNameToCheck) => {
    return projects.some(project => project.projectName === projectNameToCheck);
  };
  const createproj = async () => {
    if(projectexist)
      return;
    setloading(true);
    try {
      let data = { userid: user.id, projectName, repoName, repoType: isPublic, githubtoken, selectedrepo };
      const response = await fetch(!selectedrepo?'https://buildstack.onrender.com/projects/createproj':'https://buildstack.onrender.com/projects/createprojimport', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const returneddata = await response.json();
      if(returneddata.name==='ValidationError'){
        setreponametaken(true);
        setloading(false);
        return;
      }
      addprojects(returneddata.project);
      onClose();
      setloading(false);
      setIsPublic(true);
      setProjectName('');
      setRepoName('');
      setSelectedOption(null);
      setselectedrepo('');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    const getallrepos=async()=>{
      const data={username:user.username, accessToken:githubtoken};
      try {
        const response=await fetch('https://buildstack.onrender.com/projects/getrepos',{
          method:"POST",
          headers:{"content-Type":"application/json"},
          body:JSON.stringify(data)
        });
        const returneddata=await response.json();
        // Filter out repos that are already used in projects
      const filteredRepos = returneddata.filter(repo => 
       !projects.some(project => project.repoName === repo.name)
      );
      // console.log(filteredRepos);
      
      setrepos(filteredRepos);
      } catch (error) {
        
      }
    }
    getallrepos();
  },[projects])

  const handleOptionClick = (option) => {
    setSelectedOption(selectedOption === option ? null : option);
  };

  return (
    <Modal open={open} onClose={()=>{onClose(); setProjectName(''); setprojectexist(false); setIsPublic(true); setRepoName(''); setSelectedOption(null);
      setrepos([])
    }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isSmallScreen ? "90%" : "30%",
          backgroundColor: "#1e1e1e",
          borderRadius: "10px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
          color: "white",
          fontFamily: "K2D",
          padding: 4,
        }}
      >
        {!loading ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontFamily: "K2D", fontWeight: "bold" }}
              >
                Setting Up Project
              </Typography>
              <IconButton
                onClick={()=>{onClose(); setProjectName(''); setprojectexist(false); setIsPublic(true); setRepoName(''); setSelectedOption(null);
                  setrepos([])
                }}
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography sx={{ fontFamily: "K2D", color: "white" }}>
                Project Name
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Project Name on BuildStack"
                value={projectName}
                autoComplete="off"
                onChange={(e) =>{
                  
                  setProjectName(e.target.value); setprojectexist(false);
                 
                }}
                onBlur={()=>{
                  if(checkProjectExists(projects,projectName)){
                    setprojectexist(true);
                   
                  }
                }}
                fullWidth
                InputLabelProps={{ style: { fontFamily: "K2D", color: "white" } }}
                inputProps={{
                  style: { fontFamily: "K2D", backgroundColor: "#292929", color: "white", borderRadius: 10 },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: "transparent" },
                    "&.Mui-focused fieldset": { borderColor: "transparent" }
                  }
                }}
              />
              {projectexist && <Typography sx={{ color: '#ED6C02', opacity: 0.7, fontFamily:'k2d', fontSize:isSmallScreen?12:15 }}>{`you already have a project ${projectName}`}</Typography>}

              {/* Repository Options */}
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant={selectedOption === 'create' ? "contained" : "outlined"}
                  onClick={() => handleOptionClick('create')}
                  fullWidth
                  sx={{
                    fontFamily: "K2D",
                    backgroundColor: selectedOption === 'create' ? "white" : "transparent",
                    color: selectedOption === 'create' ? "black" : "white",
                    borderColor: "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: selectedOption === 'create' ? "gray" : "rgba(255, 255, 255, 0.1)",
                      color: selectedOption === 'create' ? "white" : "white",
                    },
                  }}
                >
                  Create Repository
                </Button>
                <Button
                  variant={selectedOption === 'import' ? "contained" : "outlined"}
                  onClick={() => handleOptionClick('import')}
                  fullWidth
                  sx={{
                    fontFamily: "K2D",
                    backgroundColor: selectedOption === 'import' ? "white" : "transparent",
                    color: selectedOption === 'import' ? "black" : "white",
                    borderColor: "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: selectedOption === 'import' ? "gray" : "rgba(255, 255, 255, 0.1)",
                      color: selectedOption === 'import' ? "white" : "white",
                    },
                  }}
                >
                  Import Repository
                </Button>
              </Box>

              {/* Create Repository Options */}
              <Box
                sx={{
                  height: selectedOption === 'create' ? 'auto' : 0,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  opacity: selectedOption === 'create' ? 1 : 0,
                }}
              >
                {selectedOption === 'create' && (
                  <>
                    <Typography sx={{ fontFamily: "K2D", color: "white", mt: 2, mb:2 }}>
                      GitHub Repository Name
                    </Typography>
                    <TextField
                      variant="outlined"
                      placeholder="Repo Name on GitHub"
                      autoComplete="off"
                      value={repoName}
                      onChange={(e) =>{ setRepoName(e.target.value); setreponametaken(false);}}
                      fullWidth
                      InputLabelProps={{ style: { fontFamily: "K2D", color: "white" } }}
                      inputProps={{
                        style: { fontFamily: "K2D", backgroundColor: "#292929", color: "white", borderRadius: 10 },
                      }}
                      sx={{
                        borderRadius: "5px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "transparent" },
                          "&:hover fieldset": { borderColor: "transparent" },
                          "&.Mui-focused fieldset": { borderColor: "transparent" }
                        }
                      }}
                    />
                     {reponametaken && <Typography sx={{ color: '#ED6C02', opacity: 0.7, fontFamily:'k2d', fontSize:isSmallScreen?12:15 }}>{`repo name ${repoName} is taken`}</Typography>}


                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        variant={isPublic ? "contained" : "outlined"}
                        onClick={() => setIsPublic(true)}
                        sx={{
                          flexGrow: 1,
                          fontFamily: "K2D",
                          backgroundColor: isPublic ? "white" : "transparent",
                          color: isPublic ? "black" : "white",
                          borderColor: "white",
                          "&:hover": {
                            backgroundColor: isPublic ? "gray" : "rgba(255, 255, 255, 0.1)",
                            color: isPublic ? "white" : "white",
                          },
                        }}
                      >
                        Public Repo
                      </Button>
                      <Button
                        variant={!isPublic ? "contained" : "outlined"}
                        onClick={() => setIsPublic(false)}
                        sx={{
                          flexGrow: 1,
                          fontFamily: "K2D",
                          backgroundColor: !isPublic ? "white" : "transparent",
                          color: !isPublic ? "black" : "white",
                          borderColor: "white",
                          "&:hover": {
                            backgroundColor: !isPublic ? "gray" : "rgba(255, 255, 255, 0.1)",
                            color: !isPublic ? "white" : "white",
                          },
                        }}
                      >
                        Private Repo
                      </Button>
                    </Box>
                  </>
                )}
              </Box>

              {/* Import Repository Options */}
              <Box
                sx={{
                  height: selectedOption === 'import' ? 'auto' : 0,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  opacity: selectedOption === 'import' ? 1 : 0,
                }}
              >
                {selectedOption === 'import' && (
                  <Box 
                  sx={{ 
                    maxHeight: isSmallScreen?'400px':'300px',  // Fixed height for scroll
                    overflowY: 'auto',
                    mt: 2,
                    // Custom scrollbar styling
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#292929',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#888',
                      borderRadius: '4px',
                      '&:hover': {
                        background: '#555',
                      },
                    },
                  }}
                >
                  {repos.length===0 && (
                     <Box sx={{display:'flex', flexDirection:!isSmallScreen?'row':'column', mt:1, alignItems:'center', justifyContent:'center'}}>
                              <img src={norepoIcon} style={{width:isSmallScreen?100:50, height:isSmallScreen?100:50, marginBottom:isSmallScreen && 20}}/>
                              <Typography sx={{fontFamily:'k2d', ml:2, fontSize:20}}>you dont seem to have any repos</Typography>
                            </Box>
                  )}
                  {!selectedrepo?(<List sx={{ p: 0 }}>
                    {repos.map((repo) => (
                      <ListItem
                        key={repo.id}
                        sx={{
                          borderRadius: '8px',
                          mb: 1,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        <ListItemButton
                          sx={{
                            borderRadius: '8px',
                            //p: 2,
                          }}
                          onClick={()=>{
                            setselectedrepo(repo);
                          }}
                        >
                         <GitHubIcon sx={{mr:1}}/>
                          <ListItemText
                            primary={
                              <Typography 
                                sx={{ 
                                  fontFamily: "K2D", 
                                  color: "white",
                                }}
                              >
                                {repo.full_name}
                              </Typography>
                            }
                            
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>):(  
                    
                    <Box sx={{display:'flex', flexDirection:'row'}}><GitHubIcon sx={{mr:1}}/>
                    <Typography 
                                sx={{ 
                                  fontFamily: "K2D", 
                                  color: "white",
                                  alignItems:'center',
                                  justifyContent:'center'
                                }}
                              >
                               
                                {selectedrepo.full_name}
                              </Typography></Box>)}
                </Box>
                )}
              </Box>

              {((selectedOption==='import' && projectName && selectedrepo) || (selectedOption==='create' && projectName && repoName && isPublic)) && (
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    fontFamily: "K2D",
                    backgroundColor: "white",
                    color: "black",
                    fontWeight: "bold",
                    mt: 2,
                    "&:hover": {
                      backgroundColor: "gray",
                      color: "white",
                    },
                  }}
                  onClick={createproj}
                >
                  Create Project
                </Button>
              )}
            </Box>
          </>
        ) : (
          <CreateRepoLoader />
        )}
      </Box>
    </Modal>
  );
};

export default ProjectSetupModal;