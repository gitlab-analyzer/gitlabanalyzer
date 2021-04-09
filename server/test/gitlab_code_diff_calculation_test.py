import unittest
from manager import *

namePy = 'server/model/analyzer.py'
nameNotPy = 'client/src/App.js'

'''
Test require 2 strings for diff and name, this is input manually to make sure we know the right result.
This however cause us not to be able to create a code diff object to pass to the function
The solution for now is to modify the code so it take 2 strings instead of 2 fields of 1 code diff object when testing
'''

class TestCodeDiff(unittest.TestCase):
    
    #Test with not python file
    def test_add_a_line(self):
        diff = "+ if(1+2==3)\n"
        info = {
            "lines_added": 1,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_delete_a_line(self):
        diff = "- if(1+2==3)\n"
        info = {
            "lines_added": 0,
            "lines_deleted": 1,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_add_multiple_line(self):
        diff = "+ if(1+2==3)\n+do{\n+i=i+1}\n+return i\n"
        info = {
            "lines_added": 4,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_delete_multiple_line(self):
        diff = "- if(1+2==3)\n-do{\n-i=i+1}\n-return i\n"
        info = {
            "lines_added": 0,
            "lines_deleted": 4,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_add_and_delete_multiple_line(self):
        diff = "- if(1+2==3)\n+do{\n-i=i+1}\n-return i\n"
        info = {
            "lines_added": 1,
            "lines_deleted": 3,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_mix_add_and_delete_multiple_line_with_block_comment(self):
        diff = "- if(1+2==3)\n+do{\n-i=i+1}\n-return i\n+   /* This is a block of comment */"
        info = {
            "lines_added": 1,
            "lines_deleted": 3,
            "comments_added": 1,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_mix_add_and_delete_multiple_line_with_block_of_lines_comment(self):
        diff = "- if(1+2==3)\n+do{\n-i=i+1}\n-return i\n+   /* This is a block of comment \n+ Still block comment\n- delete a comment in a block\n+add more comment\n+add final comment */"
        info = {
            "lines_added": 1,
            "lines_deleted": 3,
            "comments_added": 4,
            "comments_deleted": 1,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_syntax_change(self):
        diff = "- {"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 1,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_syntax_change_in_modify_line_middle(self):
        diff = "- if ((1+2==3)\n+ if ((1+2)==3)"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 1,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

if __name__ == '__main__':
    unittest.main()