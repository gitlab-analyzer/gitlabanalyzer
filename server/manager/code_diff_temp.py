import re
from typing import Union, Optional, List
from model.code_diff import *
import gitlab


class codeDiffManager:
    def __init__(self) -> None:
        self.__codeDiffList: List[CodeDiff] = []

    def get_code_diff_list(self) -> list:
        return self.__codeDiffList

    def get_code_diff_statistic(self, codeDiffObject: gitlab) -> None:
        newLine = 0
        deleteLine = 0
        syntax = 0
        oldLine = ""
        isComment = False
        isSpacing = True
        python = False

        self.check_for_code_type(codeDiffObject)

        diffCode = CodeDiff(codeDiffObject)
        for line in diffCode.diff.splitlines():
            if oldLine in line:
                self.modify_to_a_line(
                    newLine, syntax, isComment, isSpacing, oldLine, line, python
                )
            else:
                self.modify_to_a_new_line(
                    newLine, deleteLine, syntax, isComment, isSpacing, line, python
                )

    def modify_to_a_line(
        self, newLine, syntax, isComment, isSpacing, oldLine, line, python
    ) -> None:
        diffs = set(char for char in line[1:]) - set(char for char in oldLine[1:])
        if len(diffs) == 1:
            if python is False:
                if "{" == diffs or "}" == diffs:
                    syntax = syntax + 1
            elif python is True:
                if ":" == diffs:
                    syntax = syntax + 1
            else:
                newLine = newLine + 1
        elif oldLine in line:
            tempLine = line.replace(oldLine, '')
            self.check_for_spacing_or_comment(isComment, isSpacing, tempLine, python)
            if not isComment or not isSpacing:
                newLine = newLine + 1

    def modify_to_a_new_line(
        self, newLine, deleteLine, syntax, isComment, isSpacing, line, python
    ) -> None:
        self.check_for_spacing_or_comment(isComment, isSpacing, line[1:], python)
        if line[0:1] == '+':
            newLine = newLine + 1
            if python is False:
                if "{" == line or "}" == line:
                    syntax = syntax + 1
                    newLine = newLine - 1
            if python is True:
                if ":" == line:
                    syntax = syntax + 1
                    newLine = newLine - 1
            if line == '+' or isComment or isSpacing:
                newLine = newLine - 1
        if line[0:1] == '-':
            deleteLine = deleteLine + 1
            if line == '-':
                deleteLine = deleteLine - 1

    def check_for_spacing_or_comment(self, isComment, isSpacing, str, python) -> None:
        for i in str:
            if i == " ":
                isComment = False
                isSpacing = True
            elif i == "#" and python is True:
                isComment = True
                isSpacing = False
                break
            elif i == "//" and python is False:
                isComment = True
                isSpacing = False
                break
            else:
                isSpacing = False
                isComment = False
                break

    def check_for_code_type(self, codeDiffObject: gitlab) -> None:
        diffCode = CodeDiff(codeDiffObject)
        fileName = diffCode.new_path
        found = re.search('\.(.+?)$', fileName).group(1)
        if found == 'py':
            python = True
