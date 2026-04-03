import axios from "axios";

export const parseRepoUrl = (url)=>{
    try {
    const parts = url.split("/").filter(Boolean);
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1].replace(".git", "");

    return { owner, repo };
  } catch (error) {
    throw new Error("Invalid GitHub URL");
  }
}

export const getRepoDetails = async (owner, repo)=>{
  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}`
  );

  return{
    name: response.data.name,
    description: response.data.description,
    stars: response.data.stargazers_count,
    language: response.data.language,
  }
};

export const getRepoFiles = async (owner, repo) =>{
    const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents`
    );

    const files = response.data
    .filter((item) => item.type === 'file')
    .map((file)=> file.name);

    return files
}

export const getRepoData = async (repoUrl) => {
    const { owner, repo } = parseRepoUrl(repoUrl);

    const details = await getRepoDetails(owner,repo);

    const files = await getRepoFiles(owner, repo);

    return{
        ...details,
        files
    };
};