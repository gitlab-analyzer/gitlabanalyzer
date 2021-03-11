from interface.gitlab_interface import GitLab
import gitlab

"""
Below are only for testing purpose
"""
if __name__ == "__main__":
    gl = gitlab.Gitlab("https://cmpt373-1211-12.cmpt.sfu.ca/", private_token="EJf7qdRqxdKWu1ydozLe")
    project = gl.projects.get(2)

    for commit in project.commits.list(all=True):
        print(commit)

    mr = project.mergerequests.get(3)
    for p in mr.commits():
        print(p)
    print("----------------")
    print(project.commits.get("17980749"))

    # myGitLab = GitLab(token="EJf7qdRqxdKWu1ydozLe", url="https://cmpt373-1211-12.cmpt.sfu.ca/")
    # print("Auth:", myGitLab.authenticate())
    # myGitLab.set_project(2)
    # mrList = myGitLab.gl.mergerequests.list(state="all", all=True)
    #
    # print(len(mrList))
    #
    # for mr in mrList:
    #     print(mr)
    # print("Username:", myGitLab.get_username())
    # projects = myGitLab.get_project_list()
    #
    # for project in projects:
    #     print(project)
    # myGitLab.set_project(19771)
    # for item in myGitLab.get_issue_list():
    #     print(item)
    #
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
