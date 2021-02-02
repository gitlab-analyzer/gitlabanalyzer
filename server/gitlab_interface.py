import gitlab

# class GitLab:


token = "uS4ai1UqTZJSeYp69Bey"
gl = gitlab.Gitlab("https://csil-git1.cs.surrey.sfu.ca/", token)
gl.auth()

projects = gl.projects.list(visibility='private')

# for project in projects:
#     print(project)

commits = projects[2].commits.list()

for commit in commits:
    print(commit)