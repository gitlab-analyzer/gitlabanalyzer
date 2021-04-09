import json

from interface.gitlab_interface import GitLab
import gitlab

"""
Below are only for testing purpose
"""
if __name__ == "__main__":
    gl = gitlab.Gitlab("https://cmpt373-1211-12.cmpt.sfu.ca/", private_token="EJf7qdRqxdKWu1ydozLe")
    project = gl.projects.get(2)
    branch_list = project.branches.list()

    tempCommit = project.commits.get("c67b9155")
    print(tempCommit)
    print(tempCommit.refs("branch"))

    for branch in branch_list:
        if branch.default:
            print(branch.name)

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
        print(commit.refs('branch'))

