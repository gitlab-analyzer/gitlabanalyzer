from interface.gitlab_interface import GitLab
from model import *
import gitlab


class MergeRequestManager:
    def __init__(self) -> None:
        self.mergeRequestList: list = []

    def add_merge_request(self, mergeRequest: gitlab):
        pass



gl = GitLab("bksg7zzFjaShH5s1mbRi", "https://csil-git1.cs.surrey.sfu.ca/")
gl.authenticate()
pList = gl.get_project_list()
# for p in pList:
#     print(p)
gl.set_project(25515)
mr, commits = gl.get_merge_requests_and_commits()
count = 0
for _ in mr:
    print(mr[count])
    print(commits[count][0])
    count = count + 1
