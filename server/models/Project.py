from typing import Union, Optional, List, Tuple
from .Issue import Issue

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
            deletion_date -> Optional[str]

            forks_count -> int
            star_count -> int

            owner -> Member

            tag_list -> List[str]
            issues_list -> List[Issue]
            merge_requests_list -> List[MergeRequest]
            branches_list -> List[Branch]
            members_list -> List[Member]
    """
    def __init__(self) -> None:
        self.__project_id: int
        self.__name: str
        self.__namespace: str
        self.__path: str
        self.__web_url: str
        self.__runners_token: str
        self.__description: str

        self.__default_branch: str
        self.__visibility: str
        self.__isArchived: bool

        self.__created_date: str
        self.__updated_date: str
        self.__deletion_date: Optional[str]

        self.__forks_count: int
        self.__star_count: int

        self.__owner: None

        self.__tag_list: List[str]
        self.__issues_list: List[Issue]
        self.__branches_list: List[None]
        self.__members_list: List[None]