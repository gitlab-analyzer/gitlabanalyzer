from interface.gitlab_interface import GitLab

"""
Below are only for testing purpose
"""
if __name__ == "__main__":
    myGitLab = GitLab(token="EJf7qdRqxdKWu1ydozLe", url="https://cmpt373-1211-12.cmpt.sfu.ca/")
    print("Auth:", myGitLab.authenticate())
    print("Username:", myGitLab.get_username())
    projects = myGitLab.get_project_list()

    for project in projects:
        print(project)
    myGitLab.set_project(19771)
    for item in myGitLab.get_issue_list():
        print(item)

    print("--------------------------------------")
    for item in myGitLab.get_issue_comments_list():
        print(item)
        for note in item:
            print(note)

    print("--------------------------------------")
    for item in myGitLab.get_merge_request_comment_list():
        print(item)
        for note in item:
            print(note)
