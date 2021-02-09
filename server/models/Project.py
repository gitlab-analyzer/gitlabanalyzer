from typing import Union, Optional, List, Tuple

class Project:
    """
        attributes:
            project_id -> int
            description -> str
            default_branch -> str
            visibility -> str
            web_url -> str
            tag_list -> List[str]
            owner -> Member
            name -> str
            path_with_namespace -> str
            created_date -> str
            updated_date -> str
            archived -> bool
            forks_count -> int
            star_count -> int
            runners_token -> str                        # TODO idk what this is, but it might be important
            deletion_date -> Optional[str]

            issues_list -> List[Issue]
            merge_requests_list -> List[MergeRequest]
            branches_list -> List[Branch]
            members_list -> List[Member]
    """
    pass