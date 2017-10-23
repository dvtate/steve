

# extract directory and remove storage file
DIR=`cat "dir.txt"`
rm "dir.txt"


# remove config files
cd $DIR
rm "body.html" "title.txt" "summary.txt"

cd "../../../"


# commit changes
git add --all
git commit -m "new update from "$1
git push
