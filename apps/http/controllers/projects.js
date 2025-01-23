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
  const {userid, text,diff, projectid}=req.body;
  //console.log(req.body)
  try {
    let project=await Project.findById(projectid);
    project.goals.push({addedBy:userid, text:text,diff:diff});
    await project.save();
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
    
  }
}

export const completegoal=async(req,res)=>{
  try {
    const { userid,projectid, text, diff } = req.body;
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
          project:projectid,
          diff:diff
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
      url.searchParams.append('affiliation', 'owner,collaborator,organization_member');

      const response = await fetch(url, 
        { headers:{  
          'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'} });
        const data = await response.json();
        //console.log(JSON.stringify(response))
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
export const getrepostruct = async (req, res) => {
  try {
    const { owner, repo, accessToken } = req.body;
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Excluded paths and large folder filtering
    const excludedPaths = [
      'node_modules', 
      'LICENSE', 
      'license', 
      '.github', 
      '.git', 
      'vendor', 
      'dist', 
      'build', 
      'coverage'
    ];

    if (data && data.tree) {
      const files = data.tree
        .filter(item => 
          // Exclude specific paths
          !excludedPaths.some(path => 
            item.path.startsWith(path) || 
            item.path.includes(`/${path}/`)
          ) && 
          // Filter out folders with more than 20 files
          !(item.type === 'tree' && 
            data.tree.filter(f => 
              f.path.startsWith(item.path + '/') && 
              f.type === 'blob'
            ).length > 20)
        )
        .map(item => ({
          path: item.path,
          type: item.type
        }));

      res.json(files || []);
    } else {
      res.status(404).json({
        success: false,
        message: 'Repository structure not found'
      });
    }
  } catch (error) {
    console.error('Error fetching repo structure:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch repository structure'
    });
  }
};

// export const getFormattedRepoContents=async(req, res)=>{
//   try {
//       const { repoName, username, accessToken } = req.body;
//       const baseUrl = `https://api.github.com/repos/${username}/${repoName}/contents`;
      
//       // Function to fetch file content
//       async function getFileContent(path) {
//           const response = await fetch(`${baseUrl}/${path}`, {
//               headers: {
//                   'Accept': 'application/vnd.github.v3.raw',
//                   // Add your GitHub token here if needed
//                   'Authorization': `Bearer ${accessToken}`,
//               }
//           });
          
//           if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`);
//           }
          
//           return await response.text();
//       }

//       // Function to process directory contents recursively
//       async function processDirectory(path = '') {
//           const response = await fetch(`${baseUrl}${path}`, {
//               headers: {
//                   'Accept': 'application/vnd.github.v3+json',
//                  'Authorization': `Bearer ${accessToken}`,
//               }
//           });

//           if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`);
//           }

//           const data = await response.json();
//           let formattedContent = '';
          
//           for (const item of data) {
//               if (item.type === 'file') {
//                   // Skip very large files
//                   if (item.size > 1000000) {
//                       formattedContent += `---------------------\n`;
//                       formattedContent += `${item.path}\n`;
//                       formattedContent += `---------------------\n`;
//                       formattedContent += `[File skipped: File too large (${Math.round(item.size/1024)}KB)]\n\n`;
//                       continue;
//                   }

//                   // Skip likely binary files
//                   if (isBinaryFile(item.name) || item.name ==='.gitignore' || item.name==='package-lock.json' ) {
                      
//                       continue;
//                   }

//                   try {
//                       const content = await getFileContent(item.path);
//                       formattedContent += `---------------------\n`;
//                       formattedContent += `${item.path}\n`;
//                       formattedContent += `---------------------\n`;
//                       formattedContent += `${content}\n\n`;
//                   } catch (error) {
//                       console.error(`Error fetching ${item.path}:`, error.message);
//                       formattedContent += `[Error fetching file content]\n\n`;
//                   }
//               } else if (item.type === 'dir') {
//                   formattedContent += await processDirectory('/' + item.path);
//               }
//           }
          
//           return formattedContent;
//       }

//       // Helper function to check if file is likely binary
//       function isBinaryFile(filename) {
//           // Common binary file extensions
//           const binaryExtensions = new Set([
//               // Images
//               'png', 'jpg', 'jpeg', 'gif', 'ico', 'webp', 'bmp', 'tiff',
//               // Documents
//               'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
//               // Archives
//               'zip', 'tar', 'gz', 'rar', '7z',
//               // Executables
//               'exe', 'dll', 'so', 'dylib',
//               // Media
//               'mp3', 'mp4', 'avi', 'mov', 'wav', 'flac',
//               // Other binary formats
//               'ttf', 'otf', 'woff', 'woff2', 'eot'
//           ]);

//           // Get the file extension (everything after the last dot)
//           const extension = filename.split('.').pop()?.toLowerCase();
          
//           // If there's no extension or it's not in our binary list, assume it's a text file
//           if (!extension || !binaryExtensions.has(extension)) {
//               return false;
//           }
          
//           return true;
//       }

//       // Get formatted content
//       const formattedContent = await processDirectory();
      
//       // Send response
//       res.status(200).json({
//           success: true,
//           data: formattedContent
//       });

//   } catch (error) {
//       console.error('Error:', error.message);
//       res.status(500).json({
//           success: false,
//           error: 'Failed to fetch repository contents',
//           details: error.message
//       });
//   }
// }

export const getFormattedRepoContents = async (req, res) => {
  try {
    const { repoName, username, accessToken } = req.body;
    const baseUrl = `https://api.github.com/repos/${username}/${repoName}`;

    // Fetch the full repository tree recursively
    async function fetchRepositoryTree() {
      const response = await fetch(`${baseUrl}/git/trees/main?recursive=1`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    // Fetch file contents in batches
    async function fetchFileContents(files, maxConcurrency = 10) {
      const fileContents = new Map();
      console.log(files);
      for (let i = 0; i < files.length; i += maxConcurrency) {
        const chunk = files.slice(i, i + maxConcurrency);
        
        const chunkPromises = chunk.map(async (file) => {
          // Skip large or binary files
          if (file.size > 1000000 || isBinaryFile(file.path)) {
            return null;
          }

          try {
            const response = await fetch(`${baseUrl}/contents/${file.path}`, {
              headers: {
                'Accept': 'application/vnd.github.v3.raw',
                'Authorization': `Bearer ${accessToken}`,
              }
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const content = await response.text();
            return { path: file.path, content };
          } catch (error) {
            console.error(`Error fetching ${file.path}:`, error.message);
            return null;
          }
        });

        const results = await Promise.all(chunkPromises);
        results.forEach(result => {
          if (result) {
            fileContents.set(result.path, result);
          }
        });
      }

      return fileContents;
    }

    // Helper function to check if file is binary
    function isBinaryFile(filename) {
      const binaryExtensions = new Set([
        'png', 'jpg', 'jpeg', 'gif', 'ico', 'webp', 'bmp', 'tiff',
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
        'zip', 'tar', 'gz', 'rar', '7z',
        'exe', 'dll', 'so', 'dylib',
        'mp3', 'mp4', 'avi', 'mov', 'wav', 'flac',
        'ttf', 'otf', 'woff', 'woff2', 'eot'
      ]);

      const extension = filename.split('.').pop()?.toLowerCase();
      return extension && binaryExtensions.has(extension);
    }

    // Main processing function
    async function processRepository() {
      // Fetch repository tree
      const treeData = await fetchRepositoryTree();
      //console.log(treeData);
      // Filter out directories and large/binary files
      const files = treeData.tree.filter(item => 
        item.type === 'blob' && 
        !item.path.includes('node_modules') &&
        !isBinaryFile(item.path) && 
        !item.path.includes('.gitignore') && 
        !item.path.includes('package-lock.json')
      );
      console.log(files)
      // Fetch file contents concurrently
      const fileContents = await fetchFileContents(files);

      // Generate formatted output
      let formattedContent = '';
      for (const [path, fileData] of fileContents) {
        formattedContent += `---------------------\n`;
        formattedContent += `${path}\n`;
        formattedContent += `---------------------\n`;
        formattedContent += `${fileData.content}\n\n`;
      }

      return formattedContent;
    }

    // Get formatted content
    const formattedContent = await processRepository();
    
    // Send response
    res.status(200).json({
      success: true,
      data: formattedContent
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repository contents',
      details: error.message
    });
  }
};


