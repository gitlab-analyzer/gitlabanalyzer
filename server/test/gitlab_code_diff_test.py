from interface.gitlab_interface import GitLab
import gitlab

from interface.gitlab_project_interface import GitLabProject

"""
Below are only for testing purpose
"""
if __name__ == "__main__":
    myGitLab = GitLab(token="EJf7qdRqxdKWu1ydozLe", url="https://cmpt373-1211-12.cmpt.sfu.ca/")
    if myGitLab.authenticate():
        print("authenticated")
    print("Updating all managers...")
    gitlabProjectInterface = GitLabProject(myGitLab, 2)
    print("Done!")
