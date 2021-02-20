from typing import Union, Optional, List, Tuple
from gitlab.v4.objects import Project as gl_Project

class Project:
    """
        attributes:
            project_id -> int
            name -> str
            description -> str
            web_url -> str
            path_with_namespace -> str
            runners_token -> str                        # TODO idk what this is, but it might be important

            default_branch -> str
            visibility -> str
            archived -> bool

            created_date -> str                         # ISO 8601 format
            updated_date -> str                         # ISO 8601 format

            forks_count -> int
            star_count -> int

            owner_id -> int

            tag_list -> List[str]
            # issues_id_list -> List[int]
            # merge_requests_id_list -> List[int]
            # branches_id_list -> List[int]
            # members_id_list -> List[id]
    """
    def __init__(self, gitlab_project: gl_Project) -> None:
        self.__project_id: int = gitlab_project.id
        self.__name: str = gitlab_project.name
        self.__namespace: str = gitlab_project.namespace.name
        self.__path: str = gitlab_project.path
        self.__path_namespace = gitlab_project.namespace.path
        self.__web_url: str = gitlab_project.web_url
        self.__description: str = gitlab_project.description

        self.__default_branch: str = gitlab_project.default_branch
        self.__visibility: str = gitlab_project.visibility
        self.__is_archived: bool = gitlab_project.archived

        self.__created_date: str = gitlab_project.created_at
        self.__updated_date: str = gitlab_project.last_activity_at

        self.__fork_count: int = gitlab_project.forks_count
        self.__star_count: int = gitlab_project.star_count

        self.__owner_id: int = gitlab_project.owner.id

        self.__tags_list: List[str] = gitlab_project.tag_list

        # self.__issues_list: List[int]
        # self.__branches_list: List[int]
        # self.__members_list: List[int]

    def to_json(self) -> str:
        return self.__dict__.__str__().replace("_Project__", "").replace("'", "\"")
        
    def __str__(self) -> str:
        return self.__dict__.__str__()

    # Getters
    @property
    def tags_list(self) -> Tuple[str]:
        return tuple(self.__tags_list)

    @property
    def project_id(self) -> int:
        return self.__project_id 
    
    @property
    def name(self) -> str:
        return self.__name
    
    @property
    def namespace(self) -> str:
        return self.__namespace
    
    @property
    def name_with_namespace(self) -> str:
        return "{} / {}".format(self.__name, self.__namespace) 

    @property
    def path(self) -> str:
        return self.__path

    @property
    def path_namespace(self) -> str:
        return self.__path_namespace

    @property
    def path_with_namespace(self) -> str:
        return "{}/{}".format(self.path, self.path_namespace)

    @property
    def web_url(self) -> str:
        return self.__web_url
    
    @property
    def description(self) -> str:
        return self.__description

    @property
    def default_branch(self) -> str:
        return self.__default_branch

    @property
    def visibility(self) -> str:
        return self.__visibility
    
    @property
    def is_archived(self) -> bool:
        return self.__is_archived
    
    @property
    def created_date(self) -> str:
        return self.__created_date

    @property
    def updated_date(self) -> str:
        return self.__updated_date
    
    @property
    def fork_count(self) -> int:
        return self.__fork_count
    
    @property
    def star_count(self) -> int:
        return self.__star_count

    @property
    def owner_id(self) -> int:
        return self.__owner_id

"""
gitlab.v4.objects.Project:
{
    'id': 2, 
    'description': '', 
    'name': 'Makemake_Mirrored', 
    'name_with_namespace': 'Administrator / Makemake_Mirrored', 
    'path': 'makemke_mirrored', 
    'path_with_namespace': 'root/makemke_mirrored', 
    'created_at': '2021-02-09T02:25:08.262Z', 
    'default_branch': 'master', 
    'tag_list': [], 
    'ssh_url_to_repo': 'git@cmpt373-1211-12.cmpt.sfu.ca:root/makemke_mirrored.git', 
    'http_url_to_repo': 'https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored.git', 
    'web_url': 'https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored', 
    'readme_url': 'https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/blob/master/README.md', 
    'avatar_url': None, 
    'forks_count': 0, 
    'star_count': 0, 
    'last_activity_at': '2021-02-18T23:20:56.978Z', 
    'namespace': {
        'id': 1, 
        'name': 'Administrator', 
        'path': 'root', 
        'kind': 'user', 
        'full_path': 'root', 
        'parent_id': None, 
        'avatar_url': 'https://secure.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon', 
        'web_url': 'https://cmpt373-1211-12.cmpt.sfu.ca/root'}, 
        '_links': {'self': 'https://cmpt373-1211-12.cmpt.sfu.ca/api/v4/projects/2', 
        'issues': 'https://cmpt373-1211-12.cmpt.sfu.ca/api/v4/projects/2/issues', 
        'merge_requests': 'https://cmpt373-1211-12.cmpt.sfu.ca/api/v4/projects/2/merge_requests', 
        'repo_branches': 'https://cmpt373-1211-12.cmpt.sfu.ca/api/v4/projects/2/repository/branches', 
        'labels': 'https://cmpt373-1211-12.cmpt.sfu.ca/api/v4/projects/2/labels', 
        'events': 'https://cmpt373-1211-12.cmpt.sfu.ca/api/v4/projects/2/events', 
        'members': 'https://cmpt373-1211-12.cmpt.sfu.ca/api/v4/projects/2/members'
    }, 
    'packages_enabled': True, 
    'empty_repo': False, 
    'archived': False, 
    'visibility': 'private', 
    'owner': {
        'id': 1, 
        'name': 'Administrator', 
        'username': 'root', 
        'state': 'active', 
        'avatar_url': 'https://secure.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon', 
        'web_url': 'https://cmpt373-1211-12.cmpt.sfu.ca/root'
    }, 
    'resolve_outdated_diff_discussions': False, 
    'container_registry_enabled': True, 
    'container_expiration_policy': {
        'cadence': '1d', 
        'enabled': False, 
        'keep_n': 10, 
        'older_than': '90d', 
        'name_regex': '.*', 
        'name_regex_keep': None, 
        'next_run_at': '2021-02-10T02:25:08.506Z'
    }, 
    'issues_enabled': True, 
    'merge_requests_enabled': True, 
    'wiki_enabled': True, 
    'jobs_enabled': True, 
    'snippets_enabled': True, 
    'service_desk_enabled': False, 
    'service_desk_address': None, 
    'can_create_merge_request_in': True, 
    'issues_access_level': 'enabled', 
    'repository_access_level': 'enabled', 
    'merge_requests_access_level': 'enabled', 
    'forking_access_level': 'enabled', 
    'wiki_access_level': 'enabled', 
    'builds_access_level': 'enabled', 
    'snippets_access_level': 'enabled', 
    'pages_access_level': 'private', 
    'operations_access_level': 'enabled', 
    'analytics_access_level': 'enabled', 
    'emails_disabled': None, 
    'shared_runners_enabled': True, 
    'lfs_enabled': True, 
    'creator_id': 1, 
    'import_status': 'none', 
    'open_issues_count': 0, 
    'ci_default_git_depth': 50, 
    'ci_forward_deployment_enabled': True, 
    'public_jobs': True, 
    'build_timeout': 3600, 
    'auto_cancel_pending_pipelines': 'enabled', 
    'build_coverage_regex': None, 
    'ci_config_path': None, 
    'shared_with_groups': [], 
    'only_allow_merge_if_pipeline_succeeds': False, 
    'allow_merge_on_skipped_pipeline': None, 
    'restrict_user_defined_variables': False, 
    'request_access_enabled': True, 
    'only_allow_merge_if_all_discussions_are_resolved': False,
    'remove_source_branch_after_merge': True, 
    'printing_merge_request_link_enabled': True, 
    'merge_method': 'merge', 
    'suggestion_commit_message': None, 
    'auto_devops_enabled': False, 
    'auto_devops_deploy_strategy': 'continuous', 
    'autoclose_referenced_issues': True, 
    'repository_storage': 'default', 
    'requirements_enabled': None, 
    'compliance_frameworks': [], 
    'permissions': {
        'project_access': {
            'access_level': 40, 
            'notification_level': 3
        }, 
        'group_access': None
    }
}
"""