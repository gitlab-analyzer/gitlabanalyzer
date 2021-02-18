from typing import Union, Optional, List, Tuple
from gitlab.v4.objects import ProjectIssue

class Issue:
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
        self.__author_id: int = gitlab_issue.author.id
        self.__milestone_id: Optional[int] = None if gitlab_issue.milestone is None else gitlab_issue.milestone.id # maybe not needed
        self.__closer_id: Optional[int] = gitlab_issue.closed_by.id

        self.__project_id: Union[int, str] = gitlab_issue.project_id

        self.__title: str = gitlab_issue.title
        self.__description: str = gitlab_issue.description
        self.__state: str = gitlab_issue.state
        self.__updated_date: str = gitlab_issue.updated_at
        self.__created_date: str = gitlab_issue.created_at
        self.__closed_date: Optional[str] = gitlab_issue.closed_at
        self.__due_date: Optional[str] = gitlab_issue.due_date

        self.__assignee_id_list: List[int] = [member.id for member in gitlab_issue.assignees]
        self.__labels_list: List[str] = gitlab_issue.labels

    def to_json(self) -> str:
        return self.__dict__.__str__().replace("_Issue__", "").replace("'", "\"")
        
    def __str__(self) -> str:
        return self.__dict__.__str__()

    # Getters
    @property
    def closer_id(self) -> Optional[int]:
        return self.__closer_id

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

# Testing
if __name__ == '__main__':

    testIssue = Issue()
    print(testIssue)

"""
==============================
********SCRAP NOTES***********
==============================

Test Issue 1 from gitlab vm:
{
    'id': 1, 
    'iid': 1, 
    'project_id': 2, 
    'title': 'Test Issue 1', 
    'description': 'This is the description of Test Issue #1', 
    'state': 'closed', 
    'created_at': '2021-02-16T23:45:43.931Z', 
    'updated_at': '2021-02-17T00:14:48.364Z', 
    'closed_at': '2021-02-17T00:08:09.677Z', 
    'closed_by': {
        'id': 1, 
        'name': 
        'Administrator', 
        'username': 'root', 
        'state': 'active', 
        'avatar_url': 'https://secure.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon', 
        'web_url': 'https://cmpt373-1211-12.cmpt.sfu.ca/root'
    }, 
    'labels': ['label1', 'label2', 'label3'], 
    'milestone': None, 'assignees': [
        {
            'id': 1, 
            'name': 
            'Administrator', 
            'username': 'root', 
            'state': 'active', 
            'avatar_url': 'https://secure.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon', 
            'web_url': 'https://cmpt373-1211-12.cmpt.sfu.ca/root'
        }
    ], 
    'author': {
        'id': 1, 
        'name': 'Administrator', 
        'username': 'root', 
        'state': 'active', 
        'avatar_url': 'https://secure.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon', 
        'web_url': 'https://cmpt373-1211-12.cmpt.sfu.ca/root'
    }, 
    'assignee': {
        'id': 1, 
        'name': 'Administrator', 
        'username': 'root', 
        'state': 'active', 
        'avatar_url': 'https://secure.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon', 
        'web_url': 'https://cmpt373-1211-12.cmpt.sfu.ca/root'
    }, 
    'user_notes_count': 1, 
    'merge_requests_count': 0, 
    'upvotes': 0, 
    'downvotes': 0, 
    'due_date': '2021-04-01', 
    'confidential': False, 
    'discussion_locked': None, 
    'web_url': 'https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/issues/1', 
    'time_stats': {
        'time_estimate': 0, 
        'total_time_spent': 0, 
        'human_time_estimate': None, 
        'human_total_time_spent': None
    }, 
    'task_completion_status': {
        'count': 0, 
        'completed_count': 0
    }, 
    'blocking_issues_count': 0, 
    'has_tasks': False, 
    '_links': {
        'self': 'https://cmpt373-1211-12.cmpt.sfu.ca/api/v4/projects/2/issues/1', 
        'notes': 'https://cmpt373-1211-12.cmpt.sfu.ca/api/v4/projects/2/issues/1/notes', 
        'award_emoji': 'https://cmpt373-1211-12.cmpt.sfu.ca/api/v4/projects/2/issues/1/award_emoji', 
        'project': 'https://cmpt373-1211-12.cmpt.sfu.ca/api/v4/projects/2'
    }, 
    'references': {
        'short': '#1', 
        'relative': '#1', 
        'full': 'root/makemke_mirrored#1'
    }, 
    'moved_to_id': None, 
    'service_desk_reply_to': None
}

testIssue.to_json() example output:
{
    "issue_id": -1, 
    "upvotes": -2, 
    "downvotes": -3, 
    "merge_requests_count": -4, 
    "title": "title here", 
    "description": "description here", 
    "state": "state here", 
    "updated_date": "YYYY-MM-DDTHH:MI:SS.SSSZ", 
    "created_date": "YYYY-MM-DDTHH:MI:SS.SSSZ", 
    "closed_date": "YYYY-MM-DDTHH:MI:SS.SSSZ", 
    "due_date": None, 
    "project_id": "project_id is type Union[int, str]", 
    "milestone": -1, 
    "author": -1, 
    "assignees_list": [-2, -3, -4], 
    "comments_list": [-1, -2, -3], 
    "labels_list": ["Back-End", "Test"]
}

testIssue.__dict__ example output:
{
    '_Issue__issue_id': -1, 
    '_Issue__upvotes': -2, 
    '_Issue__downvotes': -3, 
    '_Issue__merge_requests_count': -4, 
    '_Issue__title': 'title here', 
    '_Issue__description': 'description here', 
    '_Issue__state': 'state here', 
    '_Issue__updated_date': 'YYYY-MM-DDTHH:MI:SS.SSSZ', 
    '_Issue__created_date': 'YYYY-MM-DDTHH:MI:SS.SSSZ', 
    '_Issue__closed_date': 'YYYY-MM-DDTHH:MI:SS.SSSZ', 
    '_Issue__due_date': None, 
    '_Issue__project_id': 'project_id is type Union[int, str]', 
    '_Issue__milestone': -1, 
    '_Issue__author': -1, 
    '_Issue__assignees_list': [-2, -3, -4], 
    '_Issue__comments_list': [-1, -2, -3], 
    '_Issue__labels_list': ['Back-End', 'Test']
}
"""