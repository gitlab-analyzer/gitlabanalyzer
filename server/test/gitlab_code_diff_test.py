import os
import sys
sys.path.append(os.path.abspath("./server"))
from interface.gitlab_project_interface import GitLabProject
from interface.gitlab_interface import GitLab
from model.project import Project

"""
Below are only for testing purpose
"""
if __name__ == "__main__":
    myGitLab = GitLab(token="EJf7qdRqxdKWu1ydozLe", url="https://cmpt373-1211-12.cmpt.sfu.ca/")
    if myGitLab.authenticate():
        print("authenticated")
    gitLabProject = GitLabProject(project=myGitLab.find_project(2))
    gitLabProject.update(myGitLab)
    print("Done!")