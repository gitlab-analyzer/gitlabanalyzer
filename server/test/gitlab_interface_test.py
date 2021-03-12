import json

from interface.gitlab_interface import GitLab
import gitlab

"""
Below are only for testing purpose
"""
if __name__ == "__main__":
    gl = gitlab.Gitlab("https://cmpt373-1211-12.cmpt.sfu.ca/", private_token="EJf7qdRqxdKWu1ydozLe")
    project = gl.projects.get(2)
    mr = project.mergerequests.get(6)
    print(mr)

    # print the latest diff for a MR
    print(mr.diffs.get(mr.diffs.list()[0].id).diffs)
    diffs = mr.diffs.get(mr.diffs.list()[0].id).diffs
    print(type(diffs))
    for c in mr.diffs.list():
        print(c)

    # print the diff for commit
    for p in mr.commits():
        print(p.diff()[0]["old_path"])

    # print("--------------------------------------")
    # for item in myGitLab.get_issue_comments_list():
    #     print(item)
    #     for note in item:
    #         print(note)
    #
    # print("--------------------------------------")
    # for item in myGitLab.get_merge_request_comment_list():
    #     print(item)
    #     for note in item:
    #         print(note)
