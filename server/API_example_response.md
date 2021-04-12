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
- [Get all the commits committed directly on master](#get-all-the-commits-committed-directly-on-master)
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
    - `POST admin/config/garbage_monitor/start`
- [Stop garbage collector](#stop-garbage-collector)
    - `POST admin/config/garbage_monitor/stop`
- [Get garbage collector check period](#get-garbage-collector-check-period)
    - `GET admin/config/garbage_monitor/check_period`
- [Change garbage collector check period](#change-garbage-collector-check-period)
    - `POST admin/config/garbage_monitor/check_period`
- [Reset server](#reset-server-testing-only)
    - `POST admin/reset`
- [Map users](#map-users)
    - `POST /projects/<int:projectID>/map`
- [Reset user mapping](#reset-user-mapping)
    - `POST /projects/<int:projectID>/map/reset`
- [Add user config to server](#add-user-config)
    - `POST /config`
- [Get all previously added user configs](#get-all-previously-added-user-configs)
    - `GET /config`

#### Note
All the API calls will contain two variables, `response` and `cause`
- `response` will indicate if the request runs successfully
  - `True` means the request runs successfully
  - `False` means an error has occurred
- `cause` will indicate the error when response is `false`
  - possible values in the cause
    - "Invalid token"
    - "Invalid project ID"
    - "Project is syncing"
    - "Some project IDs are invalid, or they are already syncing"

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
Note: Those are commits that show up on the master branch
```json
{
    "cause": "",
    "commit_list": [
        {
            "author_name": "Administrator",
            "code_diff_detail": [
                {
                    "a_mode": "100644",
                    "b_mode": "100644",
                    "deleted_file": false,
                    "file_type": "py",
                    "line_counts": {
                        "blanks_added": 1,
                        "blanks_deleted": 0,
                        "comments_added": 0,
                        "comments_deleted": 0,
                        "lines_added": 2,
                        "lines_deleted": 0,
                        "spacing_changes": 0,
                        "syntax_changes": 0
                    },
                    "new_file": false,
                    "new_path": "server/test/gitlab_interface_test.py",
                    "old_path": "server/test/gitlab_interface_test.py",
                    "renamed_file": false
                }
            ],
            "code_diff_id": 0,
            "committed_date": "2021-03-14T01:49:26.000+00:00",
            "committer_name": "Administrator",
            "direct_to_master": false,
            "id": "c67b9155f4691a9e8a4b8892479ec3ac87e8b6a6",
            "line_counts": {
                "blanks_added": 1,
                "blanks_deleted": 0,
                "comments_added": 0,
                "comments_deleted": 0,
                "lines_added": 2,
                "lines_deleted": 0,
                "spacing_changes": 0,
                "syntax_changes": 0
            },
            "org_author": "Administrator",
            "short_id": "c67b9155",
            "title": "Update gitlab_interface_test.py",
            "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/c67b9155f4691a9e8a4b8892479ec3ac87e8b6a6"
        }
    ],
    "response": true
}
```
[Go back to API list](#api-example-response)

### Get all the commits sorted in users
#### `GET /projects/<int:projectID>/commit/user/all`
Note: Those are commits that show up on the master branch
```json
{
    "cause": "",
    "commit_list": [
        {
            "commits": [
                {
                    "author_name": "tester 88",
                    "code_diff_detail": [
                        {
                            "a_mode": "100644",
                            "b_mode": "100644",
                            "deleted_file": false,
                            "file_type": "js",
                            "line_counts": {
                                "blanks_added": 0,
                                "blanks_deleted": 2,
                                "comments_added": 0,
                                "comments_deleted": 10,
                                "lines_added": 0,
                                "lines_deleted": 0,
                                "spacing_changes": 0,
                                "syntax_changes": 0
                            },
                            "new_file": false,
                            "new_path": "client/src/components/Graphs.js",
                            "old_path": "client/src/components/Graphs.js",
                            "renamed_file": false
                        }
                    ],
                    "code_diff_id": 15,
                    "committed_date": "2021-03-12T12:15:47.000+00:00",
                    "committer_name": "tester 88",
                    "direct_to_master": false,
                    "id": "9193cfa1f347a1b2175c32d5a734c95406d160f5",
                    "line_counts": {
                        "blanks_added": 0,
                        "blanks_deleted": 2,
                        "comments_added": 0,
                        "comments_deleted": 10,
                        "lines_added": 0,
                        "lines_deleted": 0,
                        "spacing_changes": 0,
                        "syntax_changes": 0
                    },
                    "org_author": "tester 88",
                    "short_id": "9193cfa1",
                    "title": "clean up style",
                    "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/9193cfa1f347a1b2175c32d5a734c95406d160f5"
                }
            ],
            "user_name": "tester 88"
        }
    ],
    "response": true
}
```
[Go back to API list](#api-example-response)

### Get all the commits committed directly on master
#### `GET /projects/<int:projectID>/commit/master/direct/user/all`
Note: exclude merge requests and commits related in that merge requests on the master branch
```json
{
    "cause": "",
    "commit_list": {
        "xtran": [
            {
                "author_name": "xtran",
                "code_diff_detail": [
                    {
                        "a_mode": "100644",
                        "b_mode": "100644",
                        "deleted_file": false,
                        "file_type": "py",
                        "line_counts": {
                            "blanks_added": 0,
                            "blanks_deleted": 2,
                            "comments_added": 0,
                            "comments_deleted": 0,
                            "lines_added": 0,
                            "lines_deleted": 0,
                            "spacing_changes": 0,
                            "syntax_changes": 0
                        },
                        "new_file": false,
                        "new_path": "server/manager/commit_manager.py",
                        "old_path": "server/manager/commit_manager.py",
                        "renamed_file": false
                    },
                    {
                        "a_mode": "100644",
                        "b_mode": "100644",
                        "deleted_file": false,
                        "file_type": "py",
                        "line_counts": {
                            "blanks_added": 0,
                            "blanks_deleted": 1,
                            "comments_added": 0,
                            "comments_deleted": 0,
                            "lines_added": 0,
                            "lines_deleted": 0,
                            "spacing_changes": 0,
                            "syntax_changes": 0
                        },
                        "new_file": false,
                        "new_path": "server/model/commit.py",
                        "old_path": "server/model/commit.py",
                        "renamed_file": false
                    }
                ],
                "code_diff_id": 112,
                "committed_date": "2021-03-03T09:58:53.000+07:00",
                "committer_name": "xtran",
                "direct_to_master": false,
                "id": "754e3c75dabcdf824272d6012d619e1c9f7fff91",
                "line_counts": {
                    "blanks_added": 0,
                    "blanks_deleted": 3,
                    "comments_added": 0,
                    "comments_deleted": 0,
                    "lines_added": 0,
                    "lines_deleted": 0,
                    "spacing_changes": 0,
                    "syntax_changes": 0
                },
                "org_author": "xtran",
                "short_id": "754e3c75",
                "title": "format code to follow PEP8 standard",
                "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/754e3c75dabcdf824272d6012d619e1c9f7fff91"
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
                "avatar_url": "https://secure.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon",
                "id": 1,
                "name": "Administrator",
                "state": "active",
                "username": "root",
                "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root"
            },
            "code_diff_detail": [
                {
                    "a_mode": "0",
                    "b_mode": "100644",
                    "deleted_file": false,
                    "file_type": null,
                    "line_counts": {
                        "blanks_added": 1,
                        "blanks_deleted": 0,
                        "comments_added": 0,
                        "comments_deleted": 0,
                        "lines_added": 8,
                        "lines_deleted": 0,
                        "spacing_changes": 0,
                        "syntax_changes": 0
                    },
                    "new_file": true,
                    "new_path": "iteration 2 is so short",
                    "old_path": "iteration 2 is so short",
                    "renamed_file": false
                }
            ],
            "code_diff_id": 411,
            "comments": null,
            "commit_list": [
                {
                    "author_name": "Administrator",
                    "code_diff_detail": [
                        {
                            "a_mode": "0",
                            "b_mode": "100644",
                            "deleted_file": false,
                            "file_type": null,
                            "line_counts": {
                                "blanks_added": 1,
                                "blanks_deleted": 0,
                                "comments_added": 0,
                                "comments_deleted": 0,
                                "lines_added": 8,
                                "lines_deleted": 0,
                                "spacing_changes": 0,
                                "syntax_changes": 0
                            },
                            "new_file": true,
                            "new_path": "iteration 2 is so short",
                            "old_path": "iteration 2 is so short",
                            "renamed_file": false
                        }
                    ],
                    "code_diff_id": 412,
                    "committed_date": "2021-03-14T01:47:27.000Z",
                    "committer_name": "Administrator",
                    "direct_to_master": true,
                    "id": "cc01e56d9a3dfe76de618db844a0aa19ce204f12",
                    "line_counts": {
                        "blanks_added": 1,
                        "blanks_deleted": 0,
                        "comments_added": 0,
                        "comments_deleted": 0,
                        "lines_added": 8,
                        "lines_deleted": 0,
                        "spacing_changes": 0,
                        "syntax_changes": 0
                    },
                    "org_author": "Administrator",
                    "short_id": "cc01e56d",
                    "title": "Update iteration 2 is so short",
                    "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/cc01e56d9a3dfe76de618db844a0aa19ce204f12"
                }
            ],
            "created_date": "2021-03-14T01:48:10.139Z",
            "description": "",
            "id": 15,
            "iid": 15,
            "line_counts": {
                "blanks_added": 1,
                "blanks_deleted": 0,
                "comments_added": 0,
                "comments_deleted": 0,
                "lines_added": 8,
                "lines_deleted": 0,
                "spacing_changes": 0,
                "syntax_changes": 0
            },
            "merged_by": 1,
            "merged_date": "2021-03-14T01:48:17.064Z",
            "related_issue_iid": null,
            "state": "merged",
            "title": "Update iteration 2 is so short",
            "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/merge_requests/15"
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
        "Administrator": [
            {
                "author": {
                    "avatar_url": "https://secure.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon",
                    "id": 1,
                    "name": "Administrator",
                    "state": "active",
                    "username": "root",
                    "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root"
                },
                "code_diff_detail": [
                    {
                        "a_mode": "0",
                        "b_mode": "100644",
                        "deleted_file": false,
                        "file_type": null,
                        "line_counts": {
                            "blanks_added": 1,
                            "blanks_deleted": 0,
                            "comments_added": 0,
                            "comments_deleted": 0,
                            "lines_added": 8,
                            "lines_deleted": 0,
                            "spacing_changes": 0,
                            "syntax_changes": 0
                        },
                        "new_file": true,
                        "new_path": "iteration 2 is so short",
                        "old_path": "iteration 2 is so short",
                        "renamed_file": false
                    }
                ],
                "code_diff_id": 411,
                "comments": null,
                "commit_list": [
                    {
                        "author_name": "Administrator",
                        "code_diff_detail": [
                            {
                                "a_mode": "0",
                                "b_mode": "100644",
                                "deleted_file": false,
                                "file_type": null,
                                "line_counts": {
                                    "blanks_added": 1,
                                    "blanks_deleted": 0,
                                    "comments_added": 0,
                                    "comments_deleted": 0,
                                    "lines_added": 8,
                                    "lines_deleted": 0,
                                    "spacing_changes": 0,
                                    "syntax_changes": 0
                                },
                                "new_file": true,
                                "new_path": "iteration 2 is so short",
                                "old_path": "iteration 2 is so short",
                                "renamed_file": false
                            }
                        ],
                        "code_diff_id": 412,
                        "committed_date": "2021-03-14T01:47:27.000Z",
                        "committer_name": "Administrator",
                        "direct_to_master": true,
                        "id": "cc01e56d9a3dfe76de618db844a0aa19ce204f12",
                        "line_counts": {
                            "blanks_added": 1,
                            "blanks_deleted": 0,
                            "comments_added": 0,
                            "comments_deleted": 0,
                            "lines_added": 8,
                            "lines_deleted": 0,
                            "spacing_changes": 0,
                            "syntax_changes": 0
                        },
                        "org_author": "Administrator",
                        "short_id": "cc01e56d",
                        "title": "Update iteration 2 is so short",
                        "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/commit/cc01e56d9a3dfe76de618db844a0aa19ce204f12"
                    }
                ],
                "created_date": "2021-03-14T01:48:10.139Z",
                "description": "",
                "id": 15,
                "iid": 15,
                "line_counts": {
                    "blanks_added": 1,
                    "blanks_deleted": 0,
                    "comments_added": 0,
                    "comments_deleted": 0,
                    "lines_added": 8,
                    "lines_deleted": 0,
                    "spacing_changes": 0,
                    "syntax_changes": 0
                },
                "merged_by": 1,
                "merged_date": "2021-03-14T01:48:17.064Z",
                "related_issue_iid": null,
                "state": "merged",
                "title": "Update iteration 2 is so short",
                "web_url": "https://cmpt373-1211-12.cmpt.sfu.ca/root/makemke_mirrored/-/merge_requests/15"
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
            "deleted_file": false,
            "diff": "@@ -52,6 +52,25 @@ class Comment(DataObject):\n         # super().__init__() MUST BE AFTER CURRENT CLASS CONSTRUCTION IS DONE\n         super().__init__()\n \n+\n+    def get_comments_by_userID(self, userID) -> Union[List[Comment], None]:\n+        listUserID = []\n+        for comment in self.__commentList:\n+            if comment.author == userID:\n+                listUserID.append(comment)\n+        return listUserID\n+\n+    def get_comments_by_range(self, startDate, endDate) -> Union[List[Comment], None]:\n+        listTimeRange = []\n+\n+        start = parser.parse(startDate)\n+        end = parser.parse(endDate)\n+        for comment in self.__commentList:\n+            tempDate = datetime.strptime(comment.created_date, \"%Y-%m-%dT%H:%M:%S.%f%z\")\n+            if start <= tempDate <= end:\n+                listTimeRange.append(comment)\n+        return listTimeRange\n+\n     # Getters\n \n     @property\n",
            "file_type": "py",
            "line_counts": {
                "blanks_added": 4,
                "blanks_deleted": 0,
                "comments_added": 0,
                "comments_deleted": 0,
                "lines_added": 15,
                "lines_deleted": 0,
                "spacing_changes": 0,
                "syntax_changes": 0
            },
            "new_file": false,
            "new_path": "server/model/fetchmodel.py",
            "old_path": "server/model/fetchmodel.py",
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
            "author": "Administrator",
            "body": "Another another comment",
            "created_date": "2021-03-14T01:45:01.469Z",
            "id": null,
            "noteable_id": "e0835b1e",
            "noteable_iid": null,
            "noteable_type": "Commit",
            "owner_of_noteable": "Administrator",
            "ownership": "Own",
            "word_count": 3
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
        "Administrator": [
            {
                "author": "Administrator",
                "body": "Another another comment",
                "created_date": "2021-03-14T01:45:01.469Z",
                "id": null,
                "noteable_id": "e0835b1e",
                "noteable_iid": null,
                "noteable_type": "Commit",
                "owner_of_noteable": "Administrator",
                "ownership": "Own",
                "word_count": 3
            }
        ]
    },
    "response": true
}
```
[Go back to API list](#api-example-response)

### Start garbage collector
#### `POST admin/config/garbage_monitor/start`
```json
{
    "cause": "",
    "response": true
}
```
[Go back to API list](#api-example-response)

### Stop garbage collector
#### `POST admin/config/garbage_monitor/stop`
```json
{
    "cause": "",
    "response": true
}
```
[Go back to API list](#api-example-response)

### Get garbage collector check period
#### `GET admin/config/garbage_monitor/check_period`
```json
{
    "cause": "",
    "check_period": 8,
    "response": true
}
```
[Go back to API list](#api-example-response)

### Change garbage collector check period
#### `POST admin/config/garbage_monitor/check_period`
```json
{
    "cause": "",
    "response": true
}
```
Variables needed in `form-data`
- `check_period`(int): The garbage monitor will check every `check_period` **hours**

[Go back to API list](#api-example-response)

### Reset server (Testing only)
#### `POST admin/reset`
```json
{
    "cause": "",
    "response": true
}
```
[Go back to API list](#api-example-response)

### Map users
#### `POST /projects/<int:projectID>/map`
```json
{
    "cause": "",
    "response": true
}
```
**Required json body in the request:**
```json
{
    "user_mapping": {
        "fanghaof": ["Administrator", "TestUser H"],
        "Thomas Min": ["Joseph Test", "springbro294"]
    }
}
```
[Go back to API list](#api-example-response)

### Reset user mapping
#### `POST /projects/<int:projectID>/map/reset`
```json
{
    "cause": "",
    "response": true
}
```
[Go back to API list](#api-example-response)

### Add user config
#### `POST /config`
```json
{
    "cause": "",
    "response": true
}
```
**Required json body in the request:**
```json
{
    "name": "Test2",
    "value": {
        "language": "python",
        "points": 1,
        ... What ever other values in this dict, this is just an example
    }
}
```

[Go back to API list](#api-example-response)

### Get all previously added user configs
#### `GET /config`
```json
{
    "cause": "",
    "configs": {
        "Test2": {
            "language": "python",
            "points": 1
        }
    },
    "response": true
}
```
[Go back to API list](#api-example-response)