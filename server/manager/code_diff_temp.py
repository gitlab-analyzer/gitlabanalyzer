import re
from random import random, randint
from typing import Union, Optional, List
from model.code_diff import *
import gitlab


class CodeDiffAnalyzer:
    def __init__(self) -> None:
        self.__codeDiffList: List[CodeDiff] = []
        self.__listSize: int = 0

    # TODO: a way to fill the code diff list

    def get_code_diff_statistic(self, codeDiffObject: CodeDiff) -> dict:
        info = {
            "lines_added": randint(50, 500),
            "lines_deleted": randint(50, 500),
            "comments_added": randint(50, 500),
            "comments_deleted": randint(50, 500),
            "blanks_added": randint(50, 500),
            "blanks_deleted": randint(50, 500),
            "spacing_changes": randint(50, 500),
            "syntax_changes": randint(50, 500),
        }
        return info

    def modify_to_a_new_line(
        self,
        newLine,
        deleteLine,
        newCommentLine,
        deleteCommentLine,
        newBlank,
        deleteBlank,
        spacing,
        syntax,
        line,
        python,
    ) -> None:

        if line == '+':
            newBlank = newBlank + 1
            return
        if line == '-':
            deleteBlank = deleteBlank + 1
            return

        if self.check_for_spacing_or_comment(
            line[0:1], newCommentLine, deleteCommentLine, spacing, line[1:], python
        ):
            return

        if line[0:1] == '+':
            newLine = newLine + 1
            if python is False:
                if "{" == line[1:] or "}" == line[1:]:
                    syntax = syntax + 1
                    newLine = newLine - 1
            if python is True:
                if ":" == line[1:]:
                    syntax = syntax + 1
                    newLine = newLine - 1

        if line[0:1] == '-':
            deleteLine = deleteLine + 1
            if python is False:
                if "{" == line[1:] or "}" == line[1:]:
                    syntax = syntax + 1
                    deleteLine = deleteLine - 1
            if python is True:
                if ":" == line[1:]:
                    syntax = syntax + 1
                    deleteLine = deleteLine - 1

    def check_for_spacing_or_comment(
        self, signal, newCommentLine, deleteCommentLine, spacing, str, python
    ) -> bool:

        for i in str:
            if i == " ":
                continue
            elif i == "#" and python is True:
                if signal == '+':
                    newCommentLine = newCommentLine + 1
                else:
                    deleteCommentLine = deleteCommentLine + 1
                return True
            elif i == "//" and python is False:
                if signal == '+':
                    newCommentLine = newCommentLine + 1
                else:
                    deleteCommentLine = deleteCommentLine + 1
                return True
            else:
                break
        if str.isspace():
            spacing = spacing + 1
            return True

        return False

    def check_for_code_type(self, codeDiffObject: CodeDiff) -> None:
        diffCode = codeDiffObject
        fileName = diffCode.new_path
        found = re.search('\.(.+?)$', fileName).group(1)
        if found == 'py':
            python = True

    def check_middle_syntax_addition(self, line, oldLine, syntax, python) -> bool:
        temp = 0

        if len(line) > len(oldLine):
            length = len(oldLine)
            lastChar = line[len(line)]
        else:
            length = len(line)
            lastChar = oldLine[len(oldLine)]

        for i in range(1, length):
            if oldLine[i] != line[i]:
                temp = i
                break
        if temp != 0:
            if python:
                if oldLine[temp] == ":" or line[temp] == ":":
                    syntax = syntax + 1
                    return True
            else:
                if oldLine[temp] == "{" or oldLine[temp] == "}":
                    syntax = syntax + 1
                    return True
                if line[temp] == "{" or line[temp] == "}":
                    syntax = syntax + 1
                    return True
        if temp == 0:
            if python:
                if lastChar == ":" or lastChar == ":":
                    syntax = syntax + 1
                    return True
            else:
                if lastChar == "{" or lastChar == "}":
                    syntax = syntax + 1
                    return True

        return False
