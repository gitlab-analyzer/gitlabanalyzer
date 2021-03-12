from interface.gitlab_project_interface import GitLabProject
from interface.gitlab_interface import GitLab
from typing import List


# interface for our whole GitLab Analyzer Application
# has gitlab_project_interface objects, use gitlab_interface
class GitLabAnalyzer:
    def __init__(self):
        self.__user_list: List[str] = []	# list of users' names (including members + non members) we want to analyze
        self.__project_list: List[GitLabProject] = []   # list of gitlab_project_interface (list of repositories)
        self.__current_user_token = None    # hashed

        # not sure if needed
        self.__analyzing_repository = None  # the repository that we are currently analyzing
        self.__analyzing_user = None    # the user that we are currently analyzing

    def add_project(self, project: GitLabProject):
        self.__project_list.append(project)

    def add_user(self, user):   
    	self.__user_list.append(user)

    def update_users(self, gitlabProject: GitLabProject):  # fill user_list with users of the selected GitLab project
        userList = gitlabProject.user_list
        for user in userList:
            self.__user_list.append(user)

    def update_project_list(self, gitlab: GitLab):
        projectList = gitlab.get_project_list()

        for project in projectList:
            gitlabProjectInterface = GitLabProject(gitlab, project.id)
            self.__project_list.append(gitlabProjectInterface)

    def set_current_user_token(self, hashed_str):
        self.__current_user_token = hashed_str

    def match_user_with_member(self, user, member):    # this parameter is temporary
        pass

    # return list of users that are not members, comparing by name
    def get_only_non_members(self, gitlabProject: GitLabProject) -> list: 
        temp_member_list = gitlabProject.member_manager.get_member_list()
        member_list = []
        for member in temp_member_list:
            member_list.append(member.name)

        non_member_list = []

        for user in self.__user_list:
            if user not in member_list:
                non_member_list.append(user)
        return non_member_list

    # function for testing now
    def get_members_only(self, gitlabProject: GitLabProject) -> list:
        return gitlabProject.member_manager.get_member_list()

    @property
    def user_list(self):
    	return self.__user_list
    
    @property
    def project_list(self):
    	return self.__project_list

    


gl = GitLab(token="c-Z7RjtQ1qtt2vWVYbjx", url="https://csil-git1.cs.surrey.sfu.ca/")
gl.authenticate()


print("\nSTART")
# test = GitLabProject(gl, 25515)

analyzer = GitLabAnalyzer()

"""
analyzer.update_project_list(gl)

for item in analyzer.project_list:
    print(item.project_id)
"""


firstRepo = GitLabProject(gl, 25515)
"""
for item in firstRepo.user_list:
    print(item)
"""


print("\nXXXXxXXXXXXXXXXXXXXXXXXXXX\n")
print("User list (Member + Non-member")
analyzer.update_users(firstRepo)
for item in analyzer.user_list:
    print(item)

print("\nXXXXxXXXXXXXXXXXXXXXXXXXXX\n")
print("Non-member list")
testlist = analyzer.get_only_non_members(firstRepo)
for item in testlist:
    print(item)

print("\nXXXXxXXXXXXXXXXXXXXXXXXXXX\n")
print("Member list")
testlist2 = analyzer.get_members_only(firstRepo)
for item in testlist2:
    print(item.name)


