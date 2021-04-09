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
    - `POST /projects/<int:projectID>/sync/state`
- [Get a list of projects' syncing state](#get-a-list-of-projects-syncing-statebatch-processing)
    - `POST /projects/sync/batch/state`
- [Get all the members in the repo](#get-all-the-members-in-the-project)
    - `GET /projects/<int:projectID>/members`
- [Get all the committers' name](#get-all-the-users-in-the-project)
    - `GET /projects/<int:projectID>/users`
- [Get all the commit in that project](#get-all-commits-in-that-project)
    - `GET /projects/<int:projectID>/commit`
- [Get all the commits sorted in users](#get-all-the-commits-sorted-in-users)
    - `GET /projects/<int:projectID>/commit/user/all`
- [Get all the commits committed directly on master]
    - `GET /projects/<int:projectID>/commit/master/direct/user/all`
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
- [Start garbage collector](#start-garbage-collector)
    - `POST /config/garbage_monitor/start`
- [Stop garbage collector](#stop-garbage-collector)
    - `POST /config/garbage_monitor/stop`
- [Get garbage collector check period](#get-garbage-collector-check-period)
    - `GET /config/garbage_monitor/check_period`
- [Change garbage collector check period](#change-garbage-collector-check-period)
    - `POST /config/garbage_monitor/check_period`


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
- This call need a list of projectIDs (Example: `[1,2]`) of key `"project_list"` in the request body

Example javascript ajax call:
```javascript
  var dict = {project_list: [2,3]};

  $.ajax({
      type: "POST", 
      url: "http://127.0.0.1:5000/", //localhost Flask
      data : JSON.stringify(dict),
      contentType: "application/json",
  });
```

[Go back to API list](#api-example-response)

### Get project syncing state
#### `POST /projects/<int:projectID>/sync/state`
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
#### `POST /projects/sync/batch/state`
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
- This call need a list of projectIDs (Example: `[1,2]`) of key `"project_list"` in the request body

Example javascript ajax call:
```javascript
  var dict = {project_list: [2,3]};

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

### Get all the commits committed directly on master
#### `GET /projects/<int:projectID>/commit/master/direct/user/all`
```json
{
    "cause": "",
    "commit_list": {
        "Administrator": [
            {
                "author_name": "Administrator",
                "code_diff_id": 0,
                "committed_date": "2021-03-14T01:49:26.000+00:00",
                "committer_name": "Administrator",
                "direct_to_master": false,
                "id": "c67b9155f4691a9e8a4b8892479ec3ac87e8b6a6",
                "line_counts": {
                    "blanks_added": 0,
                    "blanks_deleted": 0,
                    "comments_added": 2,
                    "comments_deleted": 0,
                    "lines_added": 0,
                    "lines_deleted": 0,
                    "spacing_changes": 0,
                    "syntax_changes": 1
                },
                "short_id": "c67b9155",
                "title": "Update gitlab_interface_test.py",
                "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/c67b9155f4691a9e8a4b8892479ec3ac87e8b6a6"
            }
        ],
        "Andrew": [
            {
                "author_name": "Andrew",
                "code_diff_id": 384,
                "committed_date": "2021-02-05T01:31:20.000-08:00",
                "committer_name": "Andrew",
                "direct_to_master": false,
                "id": "1fd1e554ba6414419d8804bb8a3ff99cd11ec21a",
                "line_counts": {
                    "blanks_added": 13,
                    "blanks_deleted": 6,
                    "comments_added": 0,
                    "comments_deleted": 4,
                    "lines_added": 557,
                    "lines_deleted": 48,
                    "spacing_changes": 0,
                    "syntax_changes": 60
                },
                "short_id": "1fd1e554",
                "title": "added simple nav bar and routing",
                "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/1fd1e554ba6414419d8804bb8a3ff99cd11ec21a"
            }
        ]
    },
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
            "a_mode": "100644",
            "b_mode": "100644",
            "blanks_added": 0,
            "blanks_deleted": 0,
            "comments_added": 2,
            "comments_deleted": 0,
            "deleted_file": false,
            "diff": "@@ -1,5 +1,8 @@\n from interface.gitlab_interface import GitLab\n \n+for test in test:\n+    print(\"We need to write some unit test\")\n+\n \"\"\"\n Below are only for testing purpose\n \"\"\"\n",
            "lines_added": 0,
            "lines_deleted": 0,
            "new_file": false,
            "new_path": "server/test/gitlab_interface_test.py",
            "old_path": "server/test/gitlab_interface_test.py",
            "renamed_file": false,
            "spacing_changes": 0,
            "syntax_changes": 1
        },
        {
            "a_mode": "100644",
            "b_mode": "100644",
            "blanks_added": 0,
            "blanks_deleted": 0,
            "comments_added": 2,
            "comments_deleted": 0,
            "deleted_file": false,
            "diff": "@@ -1,5 +1,8 @@\n from interface.gitlab_interface import GitLab\n \n+for test in test:\n+    print(\"We need to write some unit test\")\n+\n \"\"\"\n Below are only for testing purpose\n \"\"\"\n",
            "lines_added": 0,
            "lines_deleted": 0,
            "new_file": false,
            "new_path": "server/test/app.py",
            "old_path": "server/test/app.py",
            "renamed_file": false,
            "spacing_changes": 0,
            "syntax_changes": 1
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

### Start garbage collector
#### `POST /config/garbage_monitor/start`
[Go back to API list](#api-example-response)

### Stop garbage collector
#### `POST /config/garbage_monitor/stop`
[Go back to API list](#api-example-response)

### Get garbage collector check period
#### `GET /config/garbage_monitor/check_period`
[Go back to API list](#api-example-response)

### Change garbage collector check period
#### `POST /config/garbage_monitor/check_period`

Variables needed in `form-data`
- `check_period`(int): The garbage monitor will check every `check_period` **hours**

[Go back to API list](#api-example-response)
