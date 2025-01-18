import Project from "../models/Project.js";
import Ship from "../models/Ship.js";
import User from "../models/User.js";

export const createProject = async (req, res) => {
    try {
        const { userid,projectName, repoName, repoType, githubtoken } = req.body;
    
        // Validate input
        if (!projectName || !repoName) {
          return res.status(400).json({ error: 'Project name and repository name are required' });
        }
    
        // Get user's GitHub access token
        const user = await User.findById(userid);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Create repository on GitHub
        try {
            const repodata={name:repoName,private:!repoType};
          const githubResponse = await fetch(
            'https://api.github.com/user/repos',
           { body:JSON.stringify(repodata),
            method:"POST",
             headers: {
                'Authorization': `Bearer ${githubtoken}`,
                'Accept': 'application/vnd.github.v3+json',
                "Content-Type":"application/json"
              }
            }
          );
          const returneddata=await githubResponse.json();
          //console.log(returneddata)
          // Save repository information to MongoDB
          const project = new Project({
            projectName,
            repoName,
            repoType,
            githubRepoId: returneddata.id,
            githubRepoUrl: returneddata.html_url,
            createdBy: userid,
            goals:[]
          });
    
          await project.save();
    
          res.status(201).json({
            //message: 'Repository created successfully',
            project: {
              _id: project._id,
              projectName: project.projectName,
              repoName:project.repoName,
              repoType,
              githubRepoUrl:returneddata.html_url,
              githubRepoId:returneddata.id,
              goals:project.goals
            }
          
            
          });
    
        } catch (githubError) {
          console.error('GitHub API Error:', githubError.response?.data || githubError.message);
          return res.status(500).json(githubError);
        }
    
      } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({
          error: 'Server error',
          message: error.message
        });
      }
}

export const createProjectwithImport = async (req, res) => {
  try {
      const { userid,projectName, selectedrepo } = req.body;
  
      // Validate input
      if (!projectName ) {
        return res.status(400).json({ error: 'Project name and repository name are required' });
      }
  
      // Get user's GitHub access token
      const user = await User.findById(userid);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Create repository on GitHub
      try {
        
        const project = new Project({
          projectName,
          repoName:selectedrepo.name,
          repoType:!selectedrepo.private,
          githubRepoId: selectedrepo.id,
          githubRepoUrl: selectedrepo.html_url,
          createdBy: userid,
          goals:[]
        });
  
        await project.save();
  
        res.status(201).json({
          //message: 'Repository created successfully',
          project: {
            _id: project._id,
            projectName: project.projectName,
            repoName:project.repoName,
            repoType:project.repoType,
            githubRepoUrl:selectedrepo.html_url,
            githubRepoId:selectedrepo.id,
            goals:project.goals
          }
        
          
        });
  
      } catch (githubError) {
        console.error('GitHub API Error:', githubError.response?.data || githubError.message);
        return res.status(500).json({
          error: 'Failed to create GitHub repository',
          message: githubError.response?.data?.message || githubError.message
        });
      }
  
    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({
        error: 'Server error',
        message: error.message
      });
    }
}

export const addgoalstoprojects=async(req,res)=>{
  const {userid, text, projectid}=req.body;
  console.log(req.body)
  try {
    let project=await Project.findById(projectid);
    project.goals.push({addedBy:userid, text:text});
    await project.save();
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
    
  }
}

export const completegoal=async(req,res)=>{
  try {
    const { userid,projectid, text } = req.body;
    console.log(req.body);
    // Find the project and pull (delete) the goal with matching text
    const project = await Project.findByIdAndUpdate(
        projectid,
        {
            $pull: { goals: { text: text } }
        },
        { new: true } // Return the updated document
    );

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found"
        });
    }
    let newShip = new Ship({
          userId:userid,
          title:text,
          project:projectid
        });

    //console.log(newShip);
        // Save the new ship
        let savedShip=await newShip.save();
    savedShip={...savedShip.toObject(),project}
    res.status(200).json({
        success: true,
        message: "Goal completed and removed successfully",
        project,
        ship:savedShip
    });

} catch (error) {
  console.log(error);
    res.status(500).json({
        success: false,
        message: "Error completing goal",
        error: error.message
    });
}
}

export const getprojects=async(req,res)=> {
  const {userid, githubusername, githubToken}=req.body;
  console.log(req.body);
  try {
    // Get all projects from MongoDB
    const projects = await Project.find({ createdBy: userid })
        .sort({ updatedAt: -1, createdAt: -1 });
        
    // Prepare headers for GitHub API
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${githubToken}`
    };
    
    // Fetch latest commit for each project
    const projectsWithCommits = await Promise.all(projects.map(async (project) => {
        try {
            // Skip if no repoName
            if (!project.repoName) {
                return {
                    ...project.toObject(),
                    latestCommit: null
                };
            }

            // Get latest commit for this repo
            const commitsUrl = `https://api.github.com/repos/${githubusername}/${project.repoName}/commits`;
            const commit = await fetch(commitsUrl, {
                headers,
                params: {
                    per_page: 1
                },
                method:"GET"
            });
            const commitResponse=await commit.json();
            //console.log(commitResponse)

            if (commitResponse && commitResponse.length > 0) {
                const latestCommit = commitResponse[0];
                return {
                    ...project.toObject(),
                    latestCommit: latestCommit.commit.message,
                    latestCommitDate:latestCommit.commit.author.date  
                    
                };
            }

            return {
                ...project.toObject(),
                latestCommit: null
            };

        } catch (error) {
            console.error(`Error fetching commits for ${project.repoName}:`, error.message);
            return {
                ...project.toObject(),
                latestCommit: null,
                error: 'Failed to fetch commit info'
            };
        }
    }));

    //console.log(projectsWithCommits);

    res.json(projectsWithCommits);

} catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Server error',
        message: error.message
    });
  }
}

export const getuserrepos=async(req,res)=>{
  const {accessToken,username}=req.body;
  try {
    const url = new URL('https://api.github.com/user/repos');
      url.searchParams.append('sort', 'updated');
     

      const response = await fetch(url, 
        { headers:{  
          'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'} });
        const data = await response.json();
      
        const repos = data.map(repo => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          private: repo.private,
          html_url: repo.html_url,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          language: repo.language,
          default_branch: repo.default_branch,
          visibility: repo.visibility
        }));

        res.status(200).json(repos);
  } catch (error) {
        console.log(error);
  }
}

