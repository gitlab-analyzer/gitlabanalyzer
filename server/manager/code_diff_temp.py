import re
from typing import Union, Optional, List
from model.code_diff import *
import gitlab


class codeDiffManager:
    def __init__(self) -> None:
        self.__codeDiffList: List[CodeDiff] = []

    def get_code_diff_list(self) -> list:
        return self.__codeDiffList

    def get_code_diff_statistic(self, codeDiffObject: gitlab) -> dict:
        newLine = 0
        deleteLine = 0
        newCommentLine = 0
        deleteCommentLine = 0
        newBlank = 0
        deleteBlank = 0
        syntax = 0
        spacing = 0
        oldLine = ""
        python = False

        self.check_for_code_type(codeDiffObject)

        diffCode = CodeDiff(codeDiffObject)
        for line in diffCode.diff.splitlines():

            if oldLine[1:] in line[1:] and oldLine[0] != line[0]:
                tempLine = '+' + line[1:].replace(oldLine[1:], '')
                self.modify_to_a_new_line(
                    newLine,
                    deleteLine,
                    newCommentLine,
                    deleteCommentLine,
                    newBlank,
                    deleteBlank,
                    spacing,
                    syntax,
                    tempLine,
                    python,
                )
            if line[1:] in oldLine[1:] and oldLine[0] != line[0]:
                tempLine = '-' + oldLine[1:].replace(line[1:], '')
                self.modify_to_a_new_line(
                    newLine,
                    deleteLine,
                    newCommentLine,
                    deleteCommentLine,
                    newBlank,
                    deleteBlank,
                    spacing,
                    syntax,
                    tempLine,
                    python,
                )
            else:
                self.modify_to_a_new_line(
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
                )

        info = {
            "lines_added": newLine,
            "lines_deleted": deleteLine,
            "comments_added": newCommentLine,
            "comments_deleted": deleteCommentLine,
            "blanks_added": newBlank,
            "blanks_deleted": deleteBlank,
            "spacing_changes": spacing,
            "syntax_changes": syntax,
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
        isModify = False

        for i in str:
            if i == " ":
                continue
            elif i == "#" and python is True:
                isModify = True
                if signal == '+':
                    newCommentLine = newCommentLine + 1
                else:
                    deleteCommentLine = deleteCommentLine + 1
                break
            elif i == "//" and python is False:
                isModify = True
                if signal == '+':
                    newCommentLine = newCommentLine + 1
                else:
                    deleteCommentLine = deleteCommentLine + 1
                break
            else:
                break
        if str.isspace():
            spacing = spacing + 1
            isModify = True

        return isModify

    def check_for_code_type(self, codeDiffObject: gitlab) -> None:
        diffCode = CodeDiff(codeDiffObject)
        fileName = diffCode.new_path
        found = re.search('\.(.+?)$', fileName).group(1)
        if found == 'py':
            python = True
