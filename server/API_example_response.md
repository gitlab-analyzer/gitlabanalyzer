## API Example Response
- [Authentication](#authentication)
    - `POST /auth`
- [Get all accessible projects](#get-a-list-of-projects)
    - `GET /projects`
- [Start syncing the project](#set-the-current-project-to-projectid)
    - `POST /projects/<int:projectID>/sync`
- [Sync a list of projects(batch processing)](#sync-a-list-of-projectsbatch-processing)
    - `POST /projects/sync/batch`
- [Get project syncing state](#get-project-syncing-state)
    - `GET /projects/<int:projectID>/sync/state`
- [Get a list of projects' syncing state](#get-a-list-of-projects-syncing-statebatch-processing)
    - `GET /projects/sync/batch/state`
- [Get all the members in the repo](#get-all-the-members-in-the-project)
    - `GET /projects/<int:projectID>/members`
- [Get all the committers' name](#get-all-the-users-in-the-project)
    - `GET /projects/<int:projectID>/users`
- [Get all the commit in that project](#get-all-commits-in-that-project)
    - `GET /projects/<int:projectID>/commit`
- [Get all the commits sorted in users](#get-all-the-commits-sorted-in-users)
    - `GET /projects/<int:projectID>/commit/user/all`
- [Get all the merge requests in the project](#get-all-the-merge-request-in-that-project)
    - `GET /projects/<int:projectID>/merge_request/all`
- [Get all the merge Request sorted in users](#get-all-the-merge-request-sorted-in-users)
    - `GET /projects/<int:projectID>/merge_request/user/all`
- [Get code diff based on codeDiffID](#get-a-specific-code-diff)
    - `GET /projects/<int:projectID>/code_diff/<int:codeDiffID>`
- [Get all the comments in the project](#get-all-comments-in-that-project)
    - `GET /projects/<int:projectID>/comments/all`
- [Get all the comments sorted in users](#get-all-comments-sorted-in-users)
    - `GET /projects/<int:projectID>/comments/user/all`

#### Note
All the API calls will contain two variables, `response` and `cause`
- `response` will indicate if the request runs successfully
  - `True` means the request runs successfully
  - `False` means an error has occurred
- `cause` will indicate the error when response is `false`


### Authentication
#### `POST /auth`
```json
{
    "cause": "",
    "response": true,
    "username": "Administrator"
}
```

Required body:
- Token (String)
- GitLab URL (String)

[Go back to API list](#api-example-response)

### Get a list of projects
#### `GET /projects`
```json
{
    "cause": "",
    "projects": [
        {
            "id": 3,
            "last_synced": "Thu, 01 Apr 2021 22:49:59 GMT",
            "name": "TestUser H / CMPT373_TestRepoFromProf"
        },
        {
            "id": 2,
            "last_synced": null,
            "name": "Administrator / Makemake_Mirrored"
        }
    ],
    "response": true
}
```
[Go back to API list](#api-example-response)

### Set the current project to projectID
#### `POST /projects/<int:projectID>/sync`
```json
{
    "cause": "",
    "response": true
}
```
[Go back to API list](#api-example-response)

### Sync a list of projects(batch processing)
#### `POST /projects/sync/batch`
```json
{
    "cause": "Some project IDs are invalid or they are already syncing",
    "response": false,
    "status": {
        "2": true,
        "5": false
    }
}
```
Note:
- Only valid projectIDs' status will be included in the response. 
The example above shows a call to project `2` and `5` (Project `5` does not exist)
- This call need a list of projectIDs (Example: `[1,2]`) of key `"project_id"` in the request body

Example javascript ajax call:
```javascript
  var dict = {username : "username" , password:"password"};

  $.ajax({
      type: "POST", 
      url: "http://127.0.0.1:5000/", //localhost Flask
      data : JSON.stringify(dict),
      contentType: "application/json",
  });
```

[Go back to API list](#api-example-response)

### Get project syncing state
#### `GET /projects/<int:projectID>/sync/state`
```json
{
    "cause": "",
    "status": {
        "is_syncing": false,
        "last_synced": "Sat, 27 Mar 2021 17:57:38 GMT",
        "projectID": 2,
        "syncing_progress": 100,
        "syncing_state": "Synced"
    },
    "response": true
}
```
**syncing_state (string)** possible values:
- `[Syncing data from remote..., Analyzing..., Synced]`

**syncing_progress (int)**:
- A percentage value shows the progress of syncing (0 - 100)

**last_synced** date format:
- "Wed, 17 Mar 2021 22:38:05 GMT"

[Go back to API list](#api-example-response)

### Get a list of projects' syncing state(batch processing)
#### `GET /projects/sync/batch/state`
```json
{
    "cause": "",
    "response": true,
    "status": {
        "2": {
            "is_syncing": true,
            "last_synced": null,
            "projectID": 2,
            "syncing_progress": 14,
            "syncing_state": "Syncing data from remote..."
        },
        "3": {
            "is_syncing": true,
            "last_synced": null,
            "projectID": 3,
            "syncing_progress": 42,
            "syncing_state": "Syncing data from remote..."
        }
    },
    "totalProgress": 28
}
```
Note:
- Only valid projectIDs' status will be included in the response. 
The example above shows a call to project `2` and `5` (Project `5` does not exist)
- This call need a list of projectIDs (Example: `[1,2]`) of key `"project_id"` in the request body

Example javascript ajax call:
```javascript
  var dict = {username : "username" , password:"password"};

  $.ajax({
      type: "POST", 
      url: "http://127.0.0.1:5000/", //localhost Flask
      data : JSON.stringify(dict),
      contentType: "application/json",
  });
```

[Go back to API list](#api-example-response)

### Get all the members in the project
#### `GET /projects/<int:projectID>/members`
```json
{
    "cause": "",
    "members": [
        {
            "access_level": 40,
            "id": 5,
            "name": "TestUser H",
            "state": "active",
            "username": "TestUserHenry"
        },
        {
            "access_level": 40,
            "id": 6,
            "name": "Joseph Test",
            "state": "active",
            "username": "makemaketest5"
        }
    ],
    "response": true
}
```
[Go back to API list](#api-example-response)

### Get all the users in the project
#### `GET /projects/<int:projectID>/users`
```json
{
    "cause": "",
    "users": [
        "Thomas Min",
        "jaddiet",
        "TestUser H",
        "HenryPC",
        "Henry Fang",
        "xtran",
        "Administrator",
        "Joshua Li Guo",
        "fanghaof",
        "Andrew",
        "tester 88",
        "jiwonj",
        "Joseph Test",
        "springbro294"
    ],
    "response": true
}
```
[Go back to API list](#api-example-response)

### Get all commits in that project
#### `GET /projects/<int:projectID>/commit`
```json
{
    "cause": "",
    "commit_list": [
        {
            "author_name": "Joseph Test",
            "code_diff_id": 0,
            "committed_date": "2021-03-11T19:36:18.000+00:00",
            "committer_name": "Joseph Test",
            "id": "19fa8676d5ff2c641265104b15c5a25e7581e1be",
            "line_counts": {
                "blanks_added": 659,
                "blanks_deleted": 290,
                "comments_added": 746,
                "comments_deleted": 291,
                "lines_added": 547,
                "lines_deleted": 531,
                "spacing_changes": 785,
                "syntax_changes": 435
            },
            "short_id": "19fa8676",
            "title": "Merge branch '11-implemented-paxo' into 'master'",
            "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/19fa8676d5ff2c641265104b15c5a25e7581e1be"
        },
        {
            "author_name": "Joseph Test",
            "code_diff_id": 1,
            "committed_date": "2021-03-11T11:35:26.000-08:00",
            "committer_name": "Joseph Test",
            "id": "5329ea4dde4909776fb8be714715c784c782b6d3",
            "line_counts": {
                "blanks_added": 272,
                "blanks_deleted": 431,
                "comments_added": 369,
                "comments_deleted": 428,
                "lines_added": 198,
                "lines_deleted": 139,
                "spacing_changes": 138,
                "syntax_changes": 292
            },
            "short_id": "5329ea4d",
            "title": "Final revision to wrap up",
            "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/5329ea4dde4909776fb8be714715c784c782b6d3"
        }
    ],
    "response": true
}
```
[Go back to API list](#api-example-response)

### Get all the commits sorted in users
#### `GET /projects/<int:projectID>/commit/user/all`
```json
{
    "cause": "",
    "commit_list": [
        {
            "commits": [
                {
                    "author_name": "Joseph Test",
                    "code_diff_id": 26,
                    "committed_date": "2021-03-08T20:41:20.000-08:00",
                    "committer_name": "Joseph Test",
                    "id": "b397565caac1d60a718e29cf84a08483650d7ca5",
                    "line_counts": {
                        "blanks_added": 216,
                        "blanks_deleted": 401,
                        "comments_added": 378,
                        "comments_deleted": 191,
                        "lines_added": 303,
                        "lines_deleted": 208,
                        "spacing_changes": 110,
                        "syntax_changes": 240
                    },
                    "short_id": "b397565c",
                    "title": "Add another view page",
                    "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/b397565caac1d60a718e29cf84a08483650d7ca5"
                },
                {
                    "author_name": "Joseph Test",
                    "code_diff_id": 27,
                    "committed_date": "2021-03-08T20:39:52.000-08:00",
                    "committer_name": "Joseph Test",
                    "id": "9b7ce9ddf3beb125ea858b2a1e6317d266e9eea2",
                    "line_counts": {
                        "blanks_added": 251,
                        "blanks_deleted": 381,
                        "comments_added": 318,
                        "comments_deleted": 356,
                        "lines_added": 187,
                        "lines_deleted": 54,
                        "spacing_changes": 227,
                        "syntax_changes": 365
                    },
                    "short_id": "9b7ce9dd",
                    "title": "Add new overview page",
                    "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/9b7ce9ddf3beb125ea858b2a1e6317d266e9eea2"
                }
            ],
            "user_name": "Joseph Test"
        },
        {
            "commits": [
                {
                    "author_name": "springbro294",
                    "code_diff_id": 330,
                    "committed_date": "2021-02-10T19:03:49.000+07:00",
                    "committer_name": "springbro294",
                    "id": "11d22bd9ce5e164572a3c7b1a165e414b35d3a28",
                    "line_counts": {
                        "blanks_added": 480,
                        "blanks_deleted": 284,
                        "comments_added": 336,
                        "comments_deleted": 375,
                        "lines_added": 315,
                        "lines_deleted": 398,
                        "spacing_changes": 119,
                        "syntax_changes": 306
                    },
                    "short_id": "11d22bd9",
                    "title": "Add commit class",
                    "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/11d22bd9ce5e164572a3c7b1a165e414b35d3a28"
                }
            ],
            "user_name": "springbro294"
        }
    ],
    "response": true
}
```
[Go back to API list](#api-example-response)

### Get all the merge request in that project
#### `GET /projects/<int:projectID>/merge_request/all`
```json
{
    "cause": "",
    "merge_request_list": [
        {
            "author": {
                "avatar_url": "https://secure.gravatar.com/avatar/59dc0730d84b7f2352369dea4836d077?s=80&d=identicon",
                "id": 6,
                "name": "Joseph Test",
                "state": "active",
                "username": "makemaketest5",
                "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/makemaketest5"
            },
            "code_diff_id": 392,
            "comments": null,
            "commit_list": [
                {
                    "author_name": "Joseph Test",
                    "code_diff_id": 395,
                    "committed_date": "2021-03-11T19:33:59.000Z",
                    "committer_name": "Joseph Test",
                    "id": "9e6744896c0126939dfd5b15e9a79e9112eab8d4",
                    "line_counts": {
                        "blanks_added": 62,
                        "blanks_deleted": 239,
                        "comments_added": 281,
                        "comments_deleted": 148,
                        "lines_added": 444,
                        "lines_deleted": 249,
                        "spacing_changes": 286,
                        "syntax_changes": 219
                    },
                    "short_id": "9e674489",
                    "title": "Add logic class for basic paxo procotol",
                    "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/9e6744896c0126939dfd5b15e9a79e9112eab8d4"
                },
                {
                    "author_name": "Joseph Test",
                    "code_diff_id": 396,
                    "committed_date": "2021-03-11T19:30:23.000Z",
                    "committer_name": "Joseph Test",
                    "id": "64bf8dd279947d857616317a55f0f45a78a27d0e",
                    "line_counts": {
                        "blanks_added": 412,
                        "blanks_deleted": 111,
                        "comments_added": 284,
                        "comments_deleted": 280,
                        "lines_added": 473,
                        "lines_deleted": 492,
                        "spacing_changes": 323,
                        "syntax_changes": 449
                    },
                    "short_id": "64bf8dd2",
                    "title": "Initial commit to create stubs and getters and setters",
                    "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/64bf8dd279947d857616317a55f0f45a78a27d0e"
                }
            ],
            "created_date": "2021-03-11T19:36:08.651Z",
            "description": "Closes #11",
            "id": 9,
            "iid": 9,
            "line_counts": {
                "blanks_added": 134,
                "blanks_deleted": 159,
                "comments_added": 261,
                "comments_deleted": 480,
                "lines_added": 352,
                "lines_deleted": 146,
                "spacing_changes": 460,
                "syntax_changes": 445
            },
            "merged_by": 6,
            "merged_date": "2021-03-11T19:36:19.943Z",
            "related_issue_iid": 11,
            "state": "merged",
            "title": "Resolve \"Implemented paxo\"",
            "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/merge_requests/9"
        },
        {
            "author": {
                "avatar_url": "https://secure.gravatar.com/avatar/59dc0730d84b7f2352369dea4836d077?s=80&d=identicon",
                "id": 6,
                "name": "Joseph Test",
                "state": "active",
                "username": "makemaketest5",
                "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/makemaketest5"
            },
            "code_diff_id": 397,
            "comments": null,
            "commit_list": [
                {
                    "author_name": "Joseph Test",
                    "code_diff_id": 404,
                    "committed_date": "2021-03-11T19:21:13.000Z",
                    "committer_name": "Joseph Test",
                    "id": "2e94747c4e2cad40752e1637af756e8a684c544d",
                    "line_counts": {
                        "blanks_added": 575,
                        "blanks_deleted": 355,
                        "comments_added": 546,
                        "comments_deleted": 577,
                        "lines_added": 511,
                        "lines_deleted": 589,
                        "spacing_changes": 875,
                        "syntax_changes": 500
                    },
                    "short_id": "2e94747c",
                    "title": "Add query notify class and logic",
                    "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/2e94747c4e2cad40752e1637af756e8a684c544d"
                }
            ],
            "created_date": "2021-03-11T19:26:26.371Z",
            "description": "New features added. This is important branch",
            "id": 8,
            "iid": 8,
            "line_counts": {
                "blanks_added": 482,
                "blanks_deleted": 167,
                "comments_added": 281,
                "comments_deleted": 207,
                "lines_added": 246,
                "lines_deleted": 65,
                "spacing_changes": 475,
                "syntax_changes": 243
            },
            "merged_by": 6,
            "merged_date": "2021-03-11T19:26:55.527Z",
            "related_issue_iid": null,
            "state": "merged",
            "title": "Resolve \"Refactor database orm\"",
            "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/merge_requests/8"
        }
    ],
    "response": true
}
```
[Go back to API list](#api-example-response)

### Get all the merge request sorted in users
#### `GET /projects/<int:projectID>/merge_request/user/all`
```json
{
    "cause": "",
    "merge_request_users_list": {
        "Joseph Test": [
            {
                "author": {
                    "avatar_url": "https://secure.gravatar.com/avatar/59dc0730d84b7f2352369dea4836d077?s=80&d=identicon",
                    "id": 6,
                    "name": "Joseph Test",
                    "state": "active",
                    "username": "makemaketest5",
                    "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/makemaketest5"
                },
                "code_diff_id": 392,
                "comments": null,
                "commit_list": [
                    {
                        "author_name": "Joseph Test",
                        "code_diff_id": 393,
                        "committed_date": "2021-03-11T19:35:26.000Z",
                        "committer_name": "Joseph Test",
                        "id": "5329ea4dde4909776fb8be714715c784c782b6d3",
                        "line_counts": {
                            "blanks_added": 207,
                            "blanks_deleted": 183,
                            "comments_added": 291,
                            "comments_deleted": 345,
                            "lines_added": 266,
                            "lines_deleted": 360,
                            "spacing_changes": 138,
                            "syntax_changes": 215
                        },
                        "short_id": "5329ea4d",
                        "title": "Final revision to wrap up",
                        "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/5329ea4dde4909776fb8be714715c784c782b6d3"
                    }
                ],
                "created_date": "2021-03-11T19:36:08.651Z",
                "description": "Closes #11",
                "id": 9,
                "iid": 9,
                "line_counts": {
                    "blanks_added": 134,
                    "blanks_deleted": 159,
                    "comments_added": 261,
                    "comments_deleted": 480,
                    "lines_added": 352,
                    "lines_deleted": 146,
                    "spacing_changes": 460,
                    "syntax_changes": 445
                },
                "merged_by": 6,
                "merged_date": "2021-03-11T19:36:19.943Z",
                "related_issue_iid": 11,
                "state": "merged",
                "title": "Resolve \"Implemented paxo\"",
                "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/merge_requests/9"
            }
        ],
        "TestUser H": [
            {
                "author": {
                    "avatar_url": "https://secure.gravatar.com/avatar/23815a774084d4e3e53a95f97cc86359?s=80&d=identicon",
                    "id": 5,
                    "name": "TestUser H",
                    "state": "active",
                    "username": "TestUserHenry",
                    "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/TestUserHenry"
                },
                "code_diff_id": 411,
                "comments": null,
                "commit_list": [
                    {
                        "author_name": "TestUser H",
                        "code_diff_id": 412,
                        "committed_date": "2021-03-11T04:20:24.000Z",
                        "committer_name": "TestUser H",
                        "id": "d95a38e637e7bc8fbe9f97af4bf2114eeed29c1e",
                        "line_counts": {
                            "blanks_added": 645,
                            "blanks_deleted": 611,
                            "comments_added": 344,
                            "comments_deleted": 609,
                            "lines_added": 435,
                            "lines_deleted": 474,
                            "spacing_changes": 454,
                            "syntax_changes": 462
                        },
                        "short_id": "d95a38e6",
                        "title": "Update server/app.py, server/random.py files",
                        "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/d95a38e637e7bc8fbe9f97af4bf2114eeed29c1e"
                    }
                ],
                "created_date": "2021-03-11T04:01:02.426Z",
                "description": "Closes #9",
                "id": 6,
                "iid": 6,
                "line_counts": {
                    "blanks_added": 162,
                    "blanks_deleted": 293,
                    "comments_added": 74,
                    "comments_deleted": 107,
                    "lines_added": 397,
                    "lines_deleted": 85,
                    "spacing_changes": 367,
                    "syntax_changes": 250
                },
                "merged_by": null,
                "merged_date": null,
                "related_issue_iid": 9,
                "state": "opened",
                "title": "Update app.py",
                "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/merge_requests/6"
            },
            {
                "author": {
                    "avatar_url": "https://secure.gravatar.com/avatar/23815a774084d4e3e53a95f97cc86359?s=80&d=identicon",
                    "id": 5,
                    "name": "TestUser H",
                    "state": "active",
                    "username": "TestUserHenry",
                    "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/TestUserHenry"
                },
                "code_diff_id": 429,
                "comments": null,
                "commit_list": [
                    {
                        "author_name": "TestUser H",
                        "code_diff_id": 430,
                        "committed_date": "2021-03-09T04:30:47.000Z",
                        "committer_name": "TestUser H",
                        "id": "16e45c9e7ed5a71bb0ced8129f91abff0ef2672d",
                        "line_counts": {
                            "blanks_added": 592,
                            "blanks_deleted": 458,
                            "comments_added": 615,
                            "comments_deleted": 705,
                            "lines_added": 335,
                            "lines_deleted": 457,
                            "spacing_changes": 309,
                            "syntax_changes": 774
                        },
                        "short_id": "16e45c9e",
                        "title": "Update server/model/commit.py, server/random.py files",
                        "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/16e45c9e7ed5a71bb0ced8129f91abff0ef2672d"
                    }
                ],
                "created_date": "2021-03-09T04:32:16.109Z",
                "description": "Closes #3",
                "id": 2,
                "iid": 2,
                "line_counts": {
                    "blanks_added": 311,
                    "blanks_deleted": 422,
                    "comments_added": 177,
                    "comments_deleted": 263,
                    "lines_added": 492,
                    "lines_deleted": 95,
                    "spacing_changes": 464,
                    "syntax_changes": 462
                },
                "merged_by": 5,
                "merged_date": "2021-03-09T04:41:57.594Z",
                "related_issue_iid": 3,
                "state": "merged",
                "title": "Update server/model/commit.py, server/random.py files",
                "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/merge_requests/2"
            }
        ]
    },
    "response": true
}
```
[Go back to API list](#api-example-response)

### Get a specific code diff
#### `GET /projects/<int:projectID>/code_diff/<int:codeDiffID>`
```json
{
    "cause": "",
    "code_diff_list": [
        {
            "a_mode": "0",
            "b_mode": "100644",
            "deleted_file": false,
            "diff": "@@ -0,0 +1,100 @@\n+import copy\n+\n+class Analyzer:\n+    def __init__(self, acceptor_ids, factor=0.05):\n+        self.weight_changed = False\n+        self.acceptor_ids = acceptor_ids\n+        self.factor=factor\n+        self.num_acceptors = len(acceptor_ids)\n+        self.nominal = 1 / self.num_acceptors\n+        #self.ceiling = (int(self.num_acceptors/3)+1) * self.nominal\n+        self.ceiling = 1/2\n+\n+        self.weights = {}\n+        self.msgs_sent = {}\n+        self.msgs_recvd = {}\n+        self.msg_ratios = {}\n+        self.thresholds = {}\n+        for pid in acceptor_ids:\n+            self.weights[pid] = self.nominal\n+            self.msgs_sent[pid] = 0\n+            self.msgs_recvd[pid] = 0\n+            self.msg_ratios[pid] = 0\n+            self.thresholds[pid] = round(1-self.factor,2)\n+\n+        # make copy of state to compare before/after run\n+        self._pre = copy.copy(self)\n+\n+    def add_send(self, pid):\n+        self.msgs_sent[pid] += 1\n+\n+    def add_recvd(self, pid):\n+        self.msgs_recvd[pid] += 1\n+        try:\n+            self.msg_ratios[pid] = round(self.msgs_recvd[pid]/self.msgs_sent[pid],2)\n+        except ZeroDivisionError:\n+            pass\n+        #self.check_threshold(pid)\n+\n+    def check(self):\n+        for pid in self.acceptor_ids:\n+            self.check_threshold(pid)\n+\n+    def check_threshold(self, pid):\n+        if self.msg_ratios[pid] <= self.thresholds[pid]:\n+            self.thresholds[pid] = round(self.thresholds[pid]-self.factor,2)\n+            self.lower_weight(pid)\n+\n+    def lower_weight(self, pid):\n+        # lower the pid's weight\n+        tmp = round(self.weights[pid]-self.factor,2)\n+        if tmp > 0.0:\n+            self.weights[pid] = tmp\n+        else:\n+            self.weights[pid] = 0.0\n+        self.raise_weight()\n+        self.weight_changed = True\n+\n+    def raise_weight(self):\n+        # increase another pid's weight\n+        if self.nominal != self.ceiling:\n+            adjusted = False\n+            while not adjusted:\n+                for i in range(self.num_acceptors):\n+                    pid = self.acceptor_ids[i]\n+                    diff = self.weights[pid] - self.nominal\n+                    if diff == 0.0:\n+                        self.weights[pid] = round(self.weights[pid]+self.factor,2)\n+                        adjusted = True\n+                        break\n+                if i is (self.num_acceptors-1):\n+                    self.nominal = round(self.nominal+self.factor,2)\n+\n+    def log(self):\n+        print(\"Acceptor weights: {}\".format(self.weights))\n+        print(\"Acceptor ratios: {}\".format(self.msg_ratios))\n+        print(\"Acceptor thresholds: {}\".format(self.thresholds))\n+\n+\n+if __name__ == '__main__':\n+    import random\n+\n+    def test(acceptors, fail_rates, num_msgs):\n+        print(\"testing pids {}: \".format(acceptors))\n+        a=Analyzer(acceptors)\n+        print(\"\\nBefore rounds...\")\n+        a.log()\n+        for n in range(num_msgs):\n+            for pid in acceptors:\n+                a.add_send(pid)\n+                if fail_rates[pid] > random.random():\n+                    pass\n+                else:\n+                    a.add_recvd(pid)\n+        print(\"\\nAfter rounds...\")\n+        a.log()\n+        print('\\n')\n+\n+    test([0,1,2,3],[0,0,0.05,0],100)\n+    test([0,1,2,3,4],[0,0,0.05,0,0],100)\n+    test([0,1,2,3,4,5,6,7,8,9],[0,0,0.05,0,0,0,0,0,0.1,0],1000)\n\\ No newline at end of file\n",
            "new_file": true,
            "new_path": "server/model/analyzer.py",
            "old_path": "server/model/analyzer.py",
            "renamed_file": false
        },
        {
            "a_mode": "0",
            "b_mode": "100644",
            "deleted_file": false,
            "diff": "@@ -0,0 +1,152 @@\n+from collections import defaultdict\n+\n+from paxos.messages import *\n+\n+\n+class BasicPaxosProtocol:\n+\n+    def __init__(self, agent):\n+        self.agent = agent\n+\n+    def have_acceptor_majority(self, acceptors):\n+        \"\"\"\n+        Return True or False, depending on whether or not the passed collection\n+        of acceptors make up a majority.\n+        \"\"\"\n+        config = self.agent.config\n+        majority_weight = config.total_weight / float(2)\n+        current_weight = sum([config.weights[i] for i in acceptors])\n+        return current_weight > majority_weight\n+\n+    def tally_outbound_msgs(self):\n+        if self.agent.analyzer:\n+            for pid in self.agent.config.acceptor_ids:\n+                self.agent.analyzer.add_send(pid)\n+\n+    def tally_inbound_msgs(self, pid):\n+        if self.agent.analyzer:\n+            self.agent.analyzer.add_recvd(pid)\n+\n+    def adjust_weights(self):\n+        if self.agent.analyzer:\n+            self.agent.analyzer.check()\n+            if self.agent.analyzer.weight_changed:\n+                weights = self.agent.analyzer.weights\n+                source = self.agent.pid\n+                msg = AdjustWeightsMsg(source, weights)\n+                self.agent.send_message(msg, self.agent.config.learner_ids)\n+                print(\"--RATIOS--{}\".format(self.agent.analyzer.msg_ratios))\n+                print(\"--WEIGHTS--{}\".format(weights))\n+                self.agent.analyzer.weight_changed = False\n+\n+class BasicPaxosProposerProtocol(BasicPaxosProtocol):\n+\n+    def __init__(self, agent, proposal):\n+        super(BasicPaxosProposerProtocol, self).__init__(agent)\n+        # Request from a client.\n+        self.request = None\n+        # The current proposal for the instance started by this proposer.\n+        self.proposal = proposal\n+\n+        self.prepare_responders = set()\n+        self.highest_proposal_from_promises = Proposal(-1, None)\n+        self.accept_responders = set()\n+\n+        # States.\n+        self.state = None\n+        self.PREPARE_SENT = 0\n+        self.ACCEPT_SENT = 1\n+\n+    def handle_client_request(self, proposal):\n+        next_msg = PrepareMsg(proposal.pid, proposal)\n+        self.agent.send_message(next_msg, self.agent.config.acceptor_ids)\n+        # if dynamic weights, tally messages\n+        self.tally_outbound_msgs()\n+        self.state = self.PREPARE_SENT\n+\n+    def handle_prepare_response(self, msg):\n+        \"\"\"\n+        Handle a response to a proposal.\n+        See if we've got a response from a majority of acceptors.  If so, send\n+        accept messages to acceptors.\n+        \"\"\"\n+        self.prepare_responders.add(msg.source)\n+        self.tally_inbound_msgs(msg.source)\n+        if msg.highest_proposal.number > self.highest_proposal_from_promises.number:\n+            self.highest_proposal_from_promises = msg.highest_proposal\n+        # Check that we have sent prepare but not yet sent accept.\n+        if self.state == self.PREPARE_SENT:\n+            if self.have_acceptor_majority(self.prepare_responders):\n+                # If we have received any prepare responses with a higher\n+                # proposal number, we must use the value in that proposal.\n+                # If that value is None, then we get to choose (i.e. we'll use\n+                # the client's requested value.\n+                # Also set a flag here to note whether or not we used the\n+                # client's requested value (for retrying later).\n+                if self.highest_proposal_from_promises.value is not None:\n+                    self.proposal.value = self.highest_proposal_from_promises.value\n+                    self.client_request_handled = False\n+                else:\n+                    self.proposal.value = self.request\n+                    self.client_request_handled = True\n+                next_msg = AcceptMsg(self.agent.pid, self.proposal)\n+                # Can send to all acceptors or just the ones that responded.\n+                self.agent.send_message(next_msg, self.agent.config.acceptor_ids)\n+                #self.agent.send_message(next_msg, self.prepare_responders)\n+                self.tally_outbound_msgs()\n+                self.state = self.ACCEPT_SENT\n+\n+    def handle_accept_response(self, msg):\n+        self.accept_responders.add(msg.source)\n+        self.tally_inbound_msgs(msg.source)\n+        if self.have_acceptor_majority(self.accept_responders):\n+            self.adjust_weights()\n+\n+            class BasicPaxosAcceptorProtocol(BasicPaxosProtocol):\n+\n+    def __init__(self, agent):\n+        super(BasicPaxosAcceptorProtocol, self).__init__(agent)\n+        self.highest_proposal_promised = Proposal(-1, None)\n+        self.highest_proposal_accepted = Proposal(-1, None)\n+\n+    def handle_prepare(self, msg):\n+        if msg.proposal.number > self.highest_proposal_promised.number:\n+            self.highest_proposal_promised = msg.proposal\n+            next_msg = PrepareResponseMsg(self.agent.pid, msg.proposal,\n+                                          self.highest_proposal_accepted)\n+            self.agent.send_message(next_msg, [msg.source])\n+        # Optimization: send proposer a reject message because another proposer\n+        # has already initiated a proposal with a higher number.\n+        #else:\n+        #    msg = RejectMsg()\n+\n+    def handle_accept(self, msg):\n+        # Accept proposal unless we have already promised a higher proposal number.\n+        if msg.proposal.number >= self.highest_proposal_promised.number:\n+            # Set this accepted proposal number as the highest accepted.\n+            self.highest_proposal_accepted = msg.proposal\n+            next_msg = AcceptResponseMsg(self.agent.pid, msg.proposal)\n+            # Send \"accepted\" message to sender of the accept message\n+            # (the proposer), and to all learners.\n+            self.agent.send_message(next_msg,\n+                              [msg.source] + list(self.agent.config.learner_ids))\n+\n+\n+class BasicPaxosLearnerProtocol(BasicPaxosProtocol):\n+\n+    def __init__(self, agent):\n+        super(BasicPaxosLearnerProtocol, self).__init__(agent)\n+        # Set of acceptors that have sent an accept response.\n+        self.accept_responders = defaultdict(set)\n+\n+        self.state = None\n+        self.RESULT_SENT = 1\n+\n+    def handle_accept_response(self, msg):\n+        self.accept_responders[msg.proposal.value].add(msg.source)\n+        # Don't do anything if we've already logged the result.\n+        if self.state == self.RESULT_SENT:\n+            return\n+        if self.have_acceptor_majority(self.accept_responders[msg.proposal.value]):\n+            self.agent.log_result(msg)\n+            self.state = self.RESULT_SENT\n\\ No newline at end of file\n",
            "new_file": true,
            "new_path": "server/model/protocol.py",
            "old_path": "server/model/protocol.py",
            "renamed_file": false
        }
    ],
    "response": true
}
```
[Go back to API list](#api-example-response)

### Get all comments in that project
#### `GET /projects/<int:projectID>/comments/all`
```json
{
    "cause": "",
    "notes": [
        {
            "author": "TestUser H",
            "body": "Comments in issue",
            "created_date": "2021-03-09T04:33:55.928Z",
            "id": 8,
            "noteable_id": 3,
            "noteable_iid": 3,
            "noteable_type": "Issue",
            "word_count": 3
        },
        {
            "author": "Administrator",
            "body": "test comment",
            "created_date": "2021-02-17T00:14:48.244Z",
            "id": 2,
            "noteable_id": 1,
            "noteable_iid": 1,
            "noteable_type": "Issue",
            "word_count": 2
        }
    ],
    "response": true
}
```
[Go back to API list](#api-example-response)

### Get all comments sorted in users
#### `GET /projects/<int:projectID>/comments/user/all`
```json
{
    "cause": "",
    "notes": {
        "Joseph Test": [
            {
                "author": "Joseph Test",
                "body": "Good work, this looks good to merge.",
                "created_date": "2021-03-11T19:07:36.496Z",
                "id": 34,
                "noteable_id": 6,
                "noteable_iid": 6,
                "noteable_type": "MergeRequest",
                "word_count": 7
            },
            {
                "author": "Joseph Test",
                "body": "Maybe we should merge this with the get all route.",
                "created_date": "2021-03-11T19:07:01.545Z",
                "id": 33,
                "noteable_id": 6,
                "noteable_iid": 6,
                "noteable_type": "MergeRequest",
                "word_count": 10
            }
        ],
        "TestUser H": [
            {
                "author": "TestUser H",
                "body": "Comments in issue",
                "created_date": "2021-03-09T04:33:55.928Z",
                "id": 8,
                "noteable_id": 3,
                "noteable_iid": 3,
                "noteable_type": "Issue",
                "word_count": 3
            }
        ]
    },
    "response": true
}
```
[Go back to API list](#api-example-response)
