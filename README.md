Based on : https://gist.github.com/premitheme/c45a036e9c6d62662d081c302f51ff20

Recover MAMP MySQL database using .frm and .ibd files after InnoDB crash
After a power failure (also can be a sudden restart or system crash), I ended up with corrupted database and lost the access to my local hosted websites for development. Even the MAMP's MySQL server was not starting.

This NodeJS application will restore all .frm as .sql dumps to recreate the databases without having the need to copy and paste all the separate dbsake outputs manually into SQL.

Preparation
Make sure you have Node installed on your machine.

You will need to find the databases folders, in case of MAMP they are located in Applications/MAMP/db/mysql56 (or mysql57 depending on MySQL version).

Download this package on your machine.

You will find folders containing the database name, inside them you will find .frm and .ibd files. Take a copy of the entire folder for backup in the data folder of this package.

Go back to the Applications/MAMP/db/mysql56 and delete 3 files, ib_logfile0, ib_logfile1 and ibdata1. This will get your MAMP's MySQL server back to work.

We will use dbsake on macOS to recover tables structure.

Install dbsake
In the terminal type the following commands:

curl -s http://get.dbsake.net > dbsake

chmod u+x dbsake

Then insure that you installed dbsake properly by typing the following command:

./dbsake --version

if it return something else then something like 'not found' go to the next step.

Open terminal

Run the application:

node restore

All the SQL of your lost databases can be now found in the dumps folder. Open your SQL server application (e.g. phpMyAdmin) and create a database. Import the sql into the database.

Restore Old Data
Now in the same SQL tab of the database in phpMyAdmin, paste the folowing SQL query (Change wp_options with the table name that you have):

ALTER TABLE wp_options DISCARD TABLESPACE; (you can find a completed statement within the respective folder in file: _discard.sql)

This code will unlink and delete the empty, newly created .ibd files. Thses files holdes the actual data of the database tables, while .frm holds the tables structure only. Repeat this line of code for every database table you have (of course change the table name evry time).

After that, go to the database backup folder on the Desktop and copy all the .ibd files there and paste them in the newlycreated database folder in Applications/MAMP/db/mysql56 (or mysql57).

Then, in the same SQL tab of the database in phpMyAdmin, paste the folowing SQL query (Change wp_options with the table name that you have):

ALTER TABLE wp_options IMPORT TABLESPACE; (you can find a completed statement within the respective folder in file: _import.sql)

This will link the new database tables to the old .ibd files which hold the actual old data.

Voila! you're done and you should get your local sites working again.
