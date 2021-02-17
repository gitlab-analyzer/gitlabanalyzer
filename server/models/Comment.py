from typing import Union, Optional
import gitlab

"""
For comments from Issue / Merge Request:
* id => id of the comment itself. None if comment is on "Commit"
* noteable_type => Type of the note where comment is written (Ex. "Issue", "MergeRequest").
* noteable_id => id/sha of the note. (Ex. Issue id #28330, Commit sha 8640481e)
* noteable_iid => iid of the note. (Ex. Issue iid #1) None if comment is on "Commit"

For comments from Commit:
* body == "note" attribute of json
* noteable_id == "sha" attribute from GET parameters
* id, noteable_iid will be None

"""

class Comment:

	def __init__(self, commentForIssueMR: gitlab = None, commentForCommit: gitlab = None, commitSha: str = None) -> None:
		if commentForIssueMR is not None: 	#comment of either MergeRequest or Issue
			self.__author: int = commentForIssueMR.author['id']
			self.__body: str = commentForIssueMR.body
			self.__created_date: str = commentForIssueMR.created_at
			self.__noteable_id: Union[int, str] = commentForIssueMR.noteable_id
			self.__noteable_type: str = commentForIssueMR.noteable_type  #whether comment is on Issue / MergeRequest / Commit
			self.__noteable_iid: Optional[int] = commentForIssueMR.noteable_iid # Ex. Issue #1
			self.__id: Optional[int] = commentForIssueMR.id
		else: 		#comment of Commit
			self.__author: int = commentForCommit.author['id']
			self.__body: str = commentForCommit.note
			self.__created_date: str = commentForCommit.created_at  #datetime in ISO 8601 format
			self.__noteable_id: Union[int, str] = commitSha
			self.__noteable_type: str = "Commit"
			self.__noteable_iid: Optional[Union[int, str]] = None
			self.__id: Optional[int] = None

	def to_json(self) -> str:
		return self.__dict__.__str__().replace("_Comment__", "").replace("'", "\"")

	def __str__(self) -> str:
		return self.__dict__.__str__()

	#Getters

	@property
	def id(self) -> Optional[int]:
		return self.__id

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
	def noteable_iid(self) -> Optional[Union[int, str]]:
		return self.__noteable_iid


"""
#Test

test = Comment(123, "body", "CREATED date", 28830, "Issue", noteable_iid=1, id=12345)

print(test)
print("_______")
print(test.to_json())

"""
