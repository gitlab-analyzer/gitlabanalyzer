import json

from interface.gitlab_interface import GitLab
import gitlab

"""
Below are only for testing purpose
"""
if __name__ == "__main__":
    gl = gitlab.Gitlab("https://cmpt373-1211-12.cmpt.sfu.ca/", private_token="EJf7qdRqxdKWu1ydozLe")
    project = gl.projects.get(2)
    master_commits = project.commits.list(all=True)
    mr = project.mergerequests.get(6)
    print(mr)

    # print the latest diff for a MR
    diffs = mr.diffs.get(mr.diffs.list()[0].id).diffs

    # print the diff for commit
    for p in mr.commits():
        print(p)
        print(p.merge_requests())

    for commit in master_commits:
        print(commit)
        print(len(commit.merge_requests()))

