import axios from "axios";

export async function getGithubIssues() {
  const response = await axios.get("https://api.github.com/repos/microsoft/typescript/issues", {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    params: { per_page: 10, page: 1 },
  });
  return response.data;
}
