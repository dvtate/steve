# sets everything up for later :3

# clone website repo
echo "cloning into robobibb.github.io..."
rm -rf "robobibb.github.io"
git clone "git+ssh://git@github.com/robobibb/robobibb.github.io.git"
cd "robobibb.github.io/updates/u/"

# make a directory for the page
printf "making a new post dir... "
DIR_NUM="`ls -l . | grep -c ^d`" # how many folders are already there?
mkdir $DIR_NUM
cd $DIR_NUM
echo "done"


# download the update.zip
printf "downloading update.zip... "
wget $1 -o "update.zip"
echo "done"

echo "unzipping update..."
unzip "update.zip"
printf "unpacking update... "
mv "update/*" "."
rm -rf "update"
echo "done"

printf "deleting update.zip... "
rm update.zip
echo "done"

printf "saving dir... "
pwd > "../../../../dir.txt"
echo "done"
