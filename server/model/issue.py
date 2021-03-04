from model.data_object import DataObject
from typing import Union, Optional, List, Tuple
from gitlab.v4.objects import ProjectIssue


class Issue(DataObject):
    """
    attributes:
        issue_id -> int                 # the issue's number in the context of the project (iid)
        upvotes -> int
        downvotes -> int
        merge_requests_count -> int     # number of merge requests made for the issue
        comments_count -> int           # (user_notes_count)
        author_id -> int
        milestone_id -> Optional[int]
        closer_id -> Optional[int]      # Member who closes this issue (closed_by)

        project_id -> Union[int, str]   # project ID or URL-encoded path of the project

        title -> str
        description -> str
        state -> str                    # where the issue is on the issues board e.g. "Open", "Closed", "In Progress", etc.
        updated_date -> str             # string datetime in ISO 8601 format (updated_at)
        created_date -> str             # string datetime in ISO 8601 format (created_at)
        closed_at -> Optional[str]                # string datetime in ISO 8601 format (closed_at)
        due_date -> Optional[str]                 # string datetime in ISO 8601 format

        assignees_list -> List[int]     # An immutable list of Members' id assigned to the issue
        labels_list -> List[str]        # An immutable list of tags/labels e.g. "Critical", "Back-End", etc.

    methods:
        Getters for all attributes
        __str__()                       # implicit "to string" method
        to_json()
    """

    def __init__(self, gitlab_issue: ProjectIssue) -> None:
        self.__issue_id: int = gitlab_issue.iid
        self.__upvotes: int = gitlab_issue.upvotes
        self.__downvotes: int = gitlab_issue.downvotes
        self.__merge_requests_count: int = gitlab_issue.merge_requests_count
        self.__comment_count: int = gitlab_issue.user_notes_count
        self.__author_id: int = gitlab_issue.author['id']
        self.__milestone_id: Optional[int] = (
            None if gitlab_issue.milestone is None else gitlab_issue.milestone['id']
        )  # maybe not needed
        # self.__closer_id: Optional[int] = gitlab_issue.closed_by.id # TODO: fix bug

        self.__project_id: Union[int, str] = gitlab_issue.project_id

        self.__title: str = gitlab_issue.title
        self.__description: str = gitlab_issue.description
        self.__state: str = gitlab_issue.state
        self.__updated_date: str = gitlab_issue.updated_at
        self.__created_date: str = gitlab_issue.created_at
        self.__closed_date: Optional[str] = gitlab_issue.closed_at
        self.__due_date: Optional[str] = gitlab_issue.due_date

        self.__assignee_id_list: List[int] = [
            member['id'] for member in gitlab_issue.assignees
        ]
        self.__labels_list: List[str] = gitlab_issue.labels

        # super().__init__() MUST BE AFTER CURRENT CLASS CONSTRUCTION IS DONE
        super().__init__()

    # Getters

    # @property
    # def closer_id(self) -> Optional[int]:
    #     return self.__closer_id

    @property
    def comment_count(self) -> int:
        return self.__comment_count

    @property
    def assignee_id_list(self) -> Tuple[int]:
        return tuple(self.__assignee_id_list)

    @property
    def author_id(self) -> int:
        return self.__author_id

    @property
    def milestone_id(self) -> Optional[int]:
        return self.__milestone_id

    @property
    def labels_list(self) -> Tuple[str]:
        return tuple(self.__labels_list)

    @property
    def issue_id(self) -> int:
        return self.__issue_id

    @property
    def upvotes(self) -> int:
        return self.__upvotes

    @property
    def downvotes(self) -> int:
        return self.__downvotes

    @property
    def merge_requests_count(self) -> int:
        return self.__merge_requests_count

    @property
    def title(self) -> str:
        return self.__title

    @property
    def description(self) -> str:
        return self.__description

    @property
    def state(self) -> str:
        return self.__state

    @property
    def updated_date(self) -> str:
        return self.__updated_date

    @property
    def created_date(self) -> str:
        return self.__created_date

    @property
    def closed_date(self) -> Optional[str]:
        return self.__closed_date

    @property
    def due_date(self) -> Optional[str]:
        return self.__due_date

    @property
    def project_id(self) -> Union[int, str]:
        return self.__project_id
