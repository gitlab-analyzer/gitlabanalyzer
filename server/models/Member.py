from typing import Union, Optional, List
class MergeRequest:
	def __init__(self, id, username, name, state, access_level) -> None:
		self.__id: Union[int, str] = id 
		self.__username: str = username
		self.__name: str = name
		self.__state: str = state
		self.__access_level: int = access_level

	#Getters
	
	@property
	def id(self) -> Union[int, str]:
		return self.__id
	
	@property
	def username(self) -> str:
		return self.__username
	
	@property
	def name(self) -> str:
		return self.__name
	
	@property
	def state(self) -> str:
		return self.__state

	@property
	def access_level(self) -> int:
		return self.__access_level
	
	
	