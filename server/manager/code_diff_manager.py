from typing import List

class CodeDiffManager:
    def __init__(self):
        self.__code_diff_list: List[dict] = []
        self.__num_code_diff = 0

    def append_code_diff(self, myCodeDiff: list) -> int:
        self.__code_diff_list.append(myCodeDiff)
        self.__num_code_diff = self.__num_code_diff + 1
        return self.__num_code_diff - 1

    def get_code_diff(self, codeDiffID) -> list:
        return self.__code_diff_list[codeDiffID]
