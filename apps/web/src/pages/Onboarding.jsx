import React, { useState } from 'react';
import { Box, Typography, Button, useMediaQuery, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Logo from "../assets/images/mayflower-ship.png";
import { useDispatch, useSelector } from 'react-redux';
import { setGithubLogin, setLogin } from '../state';
import PersonaCardModal from '../components/PersonaCard';
import { useNavigate } from 'react-router-dom';
const OnboardingQuestionnaire = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const user=useSelector((state)=>state.user);
  const dispatch=useDispatch();
  const token=useSelector((state)=>state.token);
  const githubtoken=useSelector((state)=>state.githubtoken);
  const [showpersona,setshowpersona]=useState(null);
  const [isloading,setisloading]=useState(false);
  const handleOptionSelect = (optionIndex) => {
    setSelectedAnswers([...selectedAnswers, optionIndex]);
    if (currentQuestion < questionnaire.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    }
  };
  const navigate=useNavigate();
  const handleFinishOnboarding = async() => {
    setisloading(true);
    const mappedAnswers = selectedAnswers.map((answerIndex, questionIndex) => {
      const question = questionnaire[questionIndex].question;
      const answer = questionnaire[questionIndex].options[answerIndex];
      return `Q${questionIndex + 1}: ${question}\nA: ${answer}`;
    });
  
    const openAIPrompt = `
      Based on the following questions and responses from a Gen Z builder:
      ${mappedAnswers.join("\n\n")}
      Provide a 12-WORD builder persona for this user which will give insights into the user's traits to others and will be interestign to read. dont add any quotes. Just add comma where unnecessary
    `;
    
    const data={userid:user.id, prompt:openAIPrompt};
    try {
      const response=await fetch('https://buildstack.onrender.com/user/onboard',{
        body:JSON.stringify(data),
        headers:{"Content-Type":"application/json"},
        method:"POST"
      });
      const retruneddata=await response.json();
      console.log(retruneddata)
      setshowpersona(retruneddata.persona);
      setisloading(false);
      dispatch(setGithubLogin({user:retruneddata, token:token, githubtoken:githubtoken}));
    } catch (error) {
      
    }
  };
  

  const questionnaire = [
    {
      question: "Something’s broken, and the deadline is tomorrow. What’s your move?",
      options: [
        "Fix it fast and figure out the rest later—speed matters!",
        "Get everyone together and brainstorm the best solution.",
        "Stay calm and solve it step by step—no panic."
      ]
    },
    {
      question: "What’s your ideal vibe while working?",
      options: [
        "High energy, fast pace, and plenty of coffee.",
        "Chill playlists, snacks, and bouncing ideas with others.",
        "Quiet focus with no distractions—just me and my thoughts."
      ]
    },
    {
      question: "If life were a group project, how would you handle it?",
      options: [
        "Take charge and make sure everything gets done quickly.",
        "Create a solid plan and keep everyone on track.",
        "Focus on my part and make it the best it can be."
      ]
    },
    {
      question: "If you could have one superpower for work, what would it be?",
      options: [
        "Finish everything perfectly on the first try—no mistakes.",
        "Inspire others to turn big ideas into reality.",
        "Solve even the messiest problems with ease."
      ]
    },
    {
      question: "You have a weekend to create something cool. What do you do?",
      options: [
        "Build something flashy and fun—quick and exciting.",
        "Start a big idea and plan to make it amazing over time.",
        "Experiment and see where it takes me—step by step."
      ]
    },
    {
      question: "What’s the best part about finishing a project?",
      options: [
        "Seeing people use it and loving what you made.",
        "Learning new skills and getting better at what you do.",
        "Solving real problems and making life easier for others."
      ]
    }
  ];
  
  return (
    <>
     <Box sx={{  backgroundColor: 'black',display: 'flex', alignItems: 'center', flex:1, padding:2, justifyContent:'center'}}>
                  <img src={Logo} alt="logo" width={40} height= {40} />
              <Typography
                    variant="h6"
                    sx={{
                      color: '#ffffff',
                      fontFamily: 'k2d',
                      marginLeft: 2,
                      fontSize: isMobile ? '1rem' : '1.25rem', // Adjust font size
                    }}
                  >
                    BuildStack
                  </Typography>
                </Box>
    <Box 
      sx={{
        minHeight: '100vh',
    
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? 2 : 4
      }}
    >
        
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ width: '100%', maxWidth: isMobile ? '100%' : '800px' }}
        >
          <Box sx={{ textAlign: 'center', mb: isMobile ? 4 : 6, mt:-12 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography 
                variant={isMobile ? "h5" : "h4"}
                sx={{ 
                  color: 'white',
                  fontFamily: 'k2d',
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '0 0 20px rgba(255,255,255,0.2)',
                  fontSize: isMobile ? '1.5rem' : undefined
                }}
              >
                Question {currentQuestion + 1}/{questionnaire.length}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Typography 
                variant={isMobile ? "h4" : "h3"}
                sx={{ 
                  color: 'white',
                  fontFamily: 'k2d',
                  fontWeight: 'bold',
                  mb: isMobile ? 4 : 6,
                  textShadow: '0 0 20px rgba(255,255,255,0.2)',
                  fontSize: isMobile ? '1.4rem' : undefined,
                
                }}
                
              >
                {questionnaire[currentQuestion].question}
              </Typography>
            </motion.div>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 3 }}>
              {questionnaire[currentQuestion].options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                >
                  <Box
                    component={motion.div}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(index)}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: isMobile ? 3 : 4,
                      padding: isMobile ? 2 : 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        boxShadow: '0 0 30px rgba(255,255,255,0.05)'
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'white',
                        fontFamily: 'k2d',
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        textShadow: '0 0 20px rgba(255,255,255,0.2)'
                      }}
                    >
                      {option}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>

            {currentQuestion === questionnaire.length - 1 && selectedAnswers.length === questionnaire.length  && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="contained"
                  endIcon={!isloading && <ChevronRightIcon />}
                  sx={{
                    mt: isMobile ? 4 : 6,
                    backgroundColor: '#635acc',
                    color: 'white',
                    fontFamily: 'k2d',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    padding: isMobile ? '10px 24px' : '12px 32px',
                    borderRadius: isMobile ? 2 : 3,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#7468d4'
                    }
                  }}
                  onClick={()=>{if(!isloading)handleFinishOnboarding()}}
                >
                 {!isloading ?`Finish Onboarding`:<CircularProgress size={20} color='white'/>}
                </Button>
              </motion.div>
            )}
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
    {showpersona && <PersonaCardModal open={Boolean(showpersona)} onClose={()=>{setshowpersona(null); navigate('/');}} persona={showpersona}/> }
    </>
  );
};

export default OnboardingQuestionnaire;