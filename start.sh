#!/bin/bash
#Run the script using - sh test.sh 8089 project-setup deae56b89f6b40e3e2062296b671b6bee4b2abef
echo "-------------------------->Start up script invoked<--------------------------"
echo "Removing existing repo if there..."
# try to remove the repo if it already exists
rm -rf gotuktuk; true

port=$1
branch=$2
commit_id=$3
if [ -n "$branch" ]; then
    echo "Got branch name - $branch"
else
    echo "please specify a branch name. got - $branch"
    echo "run like - sh start.sh <branch_name> <commit_id>"
    exit 1
fi
cd /var/www/app

git clone https://4d9af84fc3f17b71c36c06ba5a8501d1f020e0dc@github.com/47billion/gotuktuk.git

cd gotuktuk/backend

if [ -n "$commit_id" ]; then
    echo "Got commit id - $commit_id Resetting hard to it - "
    git reset --hard $commit_id
    echo "reset done"
else
    echo "On latest commit of $branch branch"
fi
echo "Doing checkout for branch - $branch"
git checkout $branch
echo "Doing a git pull - $branch"
git pull https://4d9af84fc3f17b71c36c06ba5a8501d1f020e0dc@github.com/47billion/gotuktuk.git

npm install
echo "pm2 start -x tuktuk.js --no-daemon"
pm2 start -x pm2.json --no-daemon
