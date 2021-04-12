import os
import sys
sys.path.append(os.path.abspath("./server"))
from interface.gitlab_project_interface import GitLabProject
from interface.gitlab_interface import GitLab
from model.project import Project
from model.code_diff import CodeDiff
from manager.code_diff_Analyzer import CodeDiffAnalyzer

"""
Below are only for testing purpose
"""
if __name__ == "__main__":
    myGitLab = GitLab(token="EJf7qdRqxdKWu1ydozLe", url="https://cmpt373-1211-12.cmpt.sfu.ca/")
    if myGitLab.authenticate():
        print("authenticated")
    project = myGitLab.find_project(2)
    gitLabProject = GitLabProject(project=project)
    gitLabProject.update(myGitLab)
    print("Done!")
    temp = CodeDiffAnalyzer()
    diffs = project.commits.get("d95a38e6").diff()
    for diff in diffs:
        print(diff)
        print(temp.get_code_diff_statistic(CodeDiff(diff)), '\n')
