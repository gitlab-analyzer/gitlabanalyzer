import json
from typing import Union, Optional, List
from model.code_diff import *
import gitlab

class codeDiffManager:
    def __init__(self) -> None:
        self.__codeDiffList: List[CodeDiff] = []
    
    def get_code_diff_list(self) -> list:
        return self.__codeDiffList
    
    def get_code_diff_statistic (self, codeDiffObject: gitlab) -> None:
        newLine = 0
        deleteLine = 0
        syntax = 0
        oldLine = ""
        isComment = False
        isSpacing = True

        diffCode = CodeDiff(codeDiffObject)
        for line in diffCode.splitlines():
            diffs = set(char for char in line[1:]) - set(char for char in oldLine[1:])
            if(oldLine in line):
                self.modify_to_a_line (diffs, newLine, syntax, isComment, isSpacing, oldLine, line)
                oldLine = line
            else:
                self.modify_to_a_new_line (newLine, deleteLine, syntax, isComment, isSpacing, line)
                oldLine = line
    
    def modify_to_a_line(self, diffs, newLine, syntax, isComment, isSpacing, oldLine, line) -> None:
        if(len(diffs) == 1): #adding just one
            if ("{" in diffs or "}" in diffs):
                syntax = syntax + 1
            else:
                newLine = newLine + 1
        elif (oldLine in line):  #change to a line (not anticipating commenting to a line)
            line = line.replace(oldLine,'')
            self.check_for_spacing_or_comment (isComment, isSpacing, line)
            if(not isComment or not isSpacing):
                newLine = newLine + 1

    def modify_to_a_new_line (self, newLine, deleteLine, syntax, isComment, isSpacing, line) -> None:
        self.check_for_spacing_or_comment (isComment, isSpacing, line[1:])
        if(line[0:1] == '+'):
            newLine = newLine + 1
            # assume here syntax is added as a new line and not right next to a current line
            if("{" == line or "}" == line):
                syntax = syntax + 1
                newLine = newLine - 1
            if(line == '+' or isComment or isSpacing):  # comment and spacing add no value (trg hop comment o giua + nhieu spacing)
                newLine = newLine - 1
        if(line[0:1] == '-'):
            deleteLine = deleteLine + 1
            if(line == '-'):
                deleteLine = deleteLine - 1

    def check_for_spacing_or_comment (self, isComment, isSpacing, str) -> None:
        for i in str:
            if (i ==" "):
                isComment = False
                isSpacing = True
            elif (i == "#"):
                isComment = True
                isSpacing = False
                break
            else:
                isSpacing = False
                isComment = False
                break