from interface.gitlab_project_interface import GitLabProject
from interface.gitlab_interface import GitLab
from typing import List


class GitLabAnalyzer:
    def __init__(self):
        self.__user_list: List[str] = []	# list of users' names (including members + non members) we want to analyze
        self.__project_list: List[GitLabProject] = []   # list of repositories (Gitlab Project Interface)
        self.__current_user_token = None    # hashed

        # ex. [[xtran, springbro294], [jaddiet], ...]   
        # total length should be the length of members list
        self.__matched_user_list: Tuple[list] = []

        # temporary variables
        self.__analyzing_repository = None  
        self.__analyzing_user = None   

    def add_project(self, project: GitLabProject):
        self.__project_list.append(project)

    def add_user(self, user):   
    	self.__user_list.append(user)

    # fill user_list with users of the selected GitLab project
    def update_users(self, gitlabProject: GitLabProject): 
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

    def map_user_with_member(self, mapped_users, member):
        # This would update the matched_user_list
        pass

    def analyze_all_users_contribution(self):
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
