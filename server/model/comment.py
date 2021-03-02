from model.data_object import DataObject
from typing import Union, Optional
import gitlab

"""
For comments from Issue / Merge Request:
* id => id of the comment itself. None if comment is on "Commit"
* noteable_type => Type of the note where comment is written
    (Ex. "Issue", "MergeRequest").
* noteable_id => id/sha of the note.
    (Ex. Issue id #28330, Commit sha 8640481e)
* noteable_iid => iid of the note.
    (Ex. Issue iid #1) None if comment is on "Commit"

For comments from Commit:
* body == "note" attribute of json
* noteable_id == "sha" attribute from GET parameters
* id, noteable_iid will be None

"""


class Comment(DataObject):
    def __init__(
        self,
        commentForIssueMR: gitlab = None,
        commentForCommit: gitlab = None,
        commitSha: str = None,
    ) -> None:
        if commentForIssueMR is not None:  # comment of MergeRequest/Issue
            self.__author: int = commentForIssueMR.author["id"]
            self.__body: str = commentForIssueMR.body
            self.__created_date: str = commentForIssueMR.created_at
            self.__noteable_id: Union[int, str] = commentForIssueMR.noteable_id
            # whether comment is on Issue / MergeRequest / Commit
            self.__noteable_type: str = commentForIssueMR.noteable_type
            # Ex. Issue #1
            self.__noteable_iid: Optional[int] = commentForIssueMR.noteable_iid
            self.__id: Optional[int] = commentForIssueMR.id
        else:  # comment of Commit
            self.__author: int = commentForCommit.author["id"]
            self.__body: str = commentForCommit.note
            self.__created_date: str = (
                commentForCommit.created_at
            )  # datetime in ISO 8601 format
            self.__noteable_id: Union[int, str] = commitSha
            self.__noteable_type: str = "Commit"
            self.__noteable_iid: Optional[int] = None
            self.__id: Optional[int] = None

        # super().__init__() MUST BE AFTER CURRENT CLASS CONSTRUCTION IS DONE
        super().__init__()

    # Getters

    @property
    def author(self) -> int:
        return self.__author

    @property
    def body(self) -> str:
        return self.__body

    @property
    def created_date(self) -> str:
        return self.__created_date

    @property
    def noteable_id(self) -> Union[int, str]:
        return self.__noteable_id

    @property
    def noteable_type(self) -> str:
        return self.__noteable_type

    @property
    def noteable_iid(self) -> Optional[int]:
        return self.__noteable_iid

    @property
    def id(self) -> Optional[int]:
        return self.__id
