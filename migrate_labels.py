# You can use this script to copy my labels to your own GitHub repository. 
# Just fill in your GitHub token, repository owner, and repository name below.
# It doesn't have any relationship with the Sentinel project...
# It's just a utility script I wrote to make it easier to copy my labels to other repositories.
# Hope it helps you! 😄

import requests

# ==========================
# CONFIGURE HERE: your GitHub token, repository owner, and repository name
# ==========================

# To create a GitHub token, go to settings -> Developer settings -> Personal access tokens -> Fine-grained tokens -> Generate new token
# It must have issues:read and write permissions for the repository you want to copy the labels to. And metadata:read permission for your user account.

GITHUB_TOKEN = "YOUR_GITHUB_TOKEN_HERE" #Ex: github_pat_xxxxxxx or ghp_xxxxxxxx

OWNER = "YOUR_GITHUB_USERNAME_OR_ORG_HERE"
REPOSITORY = "YOUR_REPOSITORY_NAME_HERE"

# ==========================
# LABELS
# ==========================

LABELS = [
    # ==========================
    # AREA
    # ==========================

    {"name": "area::backend ⚙️", "color": "6699cc", "description": "Backend services and APIs"},
    {"name": "area::frontend 🖥️", "color": "cc338b", "description": "Frontend application"},
    {"name": "area::database 🗄️", "color": "e8a4cb", "description": "Database and Prisma"},
    {"name": "area::mqtt 📡", "color": "8fbc8f", "description": "MQTT communication"},
    {"name": "area::hardware 🔧", "color": "ed9121", "description": "Hardware integration"},
    {"name": "area::firmware 💾", "color": "eee600", "description": "Embedded firmware"},
    {"name": "area::docker 🐳", "color": "759ebd", "description": "Docker and containers"},
    {"name": "area::ci-cd 🚀", "color": "808080", "description": "CI/CD pipelines"},
    {"name": "area::documentation 📚", "color": "5f4bb6", "description": "Documentation"},

    # ==========================
    # TYPE
    # ==========================

    {"name": "type::feature ✨", "color": "009966", "description": "New feature"},
    {"name": "type::bug 🐞", "color": "d9534f", "description": "Bug report"},
    {"name": "type::refactor ♻️", "color": "6699cc", "description": "Code refactoring"},
    {"name": "type::performance ⚡", "color": "cd5b45", "description": "Performance improvements"},
    {"name": "type::security 🛡️", "color": "11aacc", "description": "Security related"},
    {"name": "type::documentation 📚", "color": "9400d3", "description": "Documentation"},
    {"name": "type::research 🔬", "color": "e6e6fa", "description": "Research and investigation"},
    {"name": "type::question ❓", "color": "808080", "description": "Question or discussion"},
    {"name": "type::test 🧪", "color": "a371f7", "description": "Testing"},
    {"name": "type::chore 🧹", "color": "36454f", "description": "Maintenance tasks"},

    # ==========================
    # PRIORITY
    # ==========================

    {"name": "priority::critical 🔥", "color": "b60205", "description": "Critical priority"},
    {"name": "priority::high 🔴", "color": "ff4848", "description": "High priority"},
    {"name": "priority::medium 🟡", "color": "ffd966", "description": "Medium priority"},
    {"name": "priority::low 🟢", "color": "8fbc8f", "description": "Low priority"},

    # ==========================
    # STATUS
    # ==========================

    {"name": "status::blocked 🚫", "color": "d9534f", "description": "Blocked by another task"},
    {"name": "status::waiting ⏳", "color": "fbca04", "description": "Waiting for external dependency"},
    {"name": "status::in-progress 🚧", "color": "1d76db", "description": "Currently being worked on"},
    {"name": "status::review 👀", "color": "5319e7", "description": "Awaiting code review"},
    {"name": "status::ready ✅", "color": "0e8a16", "description": "Ready to merge"},

    # ==========================
    # DIFFICULTY
    # ==========================

    {"name": "difficulty::easy 🟢", "color": "0e8a16", "description": "Good for beginners"},
    {"name": "difficulty::medium 🟡", "color": "fbca04", "description": "Moderate complexity"},
    {"name": "difficulty::hard 🔴", "color": "b60205", "description": "Complex task"},

    # ==========================
    # OPEN SOURCE
    # ==========================

    {"name": "good first issue 🌱", "color": "7057ff", "description": "Good first contribution"},
    {"name": "help wanted 🙌", "color": "008672", "description": "Community help wanted"},
    {"name": "dependencies 📦", "color": "0366d6", "description": "Dependency updates"},
    {"name": "breaking change 💥", "color": "b60205", "description": "Breaking API change"},
    {"name": "duplicate 📋", "color": "cfd3d7", "description": "Duplicate issue"},
    {"name": "invalid 🚷", "color": "e4e669", "description": "Invalid issue"},
    {"name": "wontfix 🙅", "color": "ffffff", "description": "Will not be implemented"},
    {"name": "needs discussion 💬", "color": "d4c5f9", "description": "Requires design discussion"},
    {"name": "epic 🗺️", "color": "5319e7", "description": "Large feature spanning multiple issues"},
]

# ==========================
# SCRIPT
# ==========================

headers = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
}

url = f"https://api.github.com/repos/{OWNER}/{REPOSITORY}/labels"

print(f"Creating labels in {OWNER}/{REPOSITORY}...\n")

for label in LABELS:

    response = requests.post(
        url,
        headers=headers,
        json={
            "name": label["name"],
            "color": label["color"],
            "description": "",
        },
    )

    if response.status_code == 201:
        print(f"✅ Created: {label['name']}")

    elif response.status_code == 422:
        print(f"⚠️ Already exists: {label['name']}")

    else:
        print(f"❌ Error creating {label['name']}")
        print(response.text)

print("\nDone!")