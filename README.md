Flickr Data Organizer 
=====================

This script helps you to organize all data from your Flickr account. It could be very useful if you don't want use paid Flickr anymore. 

The output is convenient: Photos are renamed by Flickr names and its order is preserved - files and folders (albums) are prefixed with numbers. 

Requirements 
------------
- Installed NodeJS on your system 
- Enough space on hard drive - this script makes copies 

How to use it? 
--------------

1. Request all data from your Flickr account (User settings), wait since it's prepared
2. Create a directory e.g. `flickr`
3. Create a subdirectory there: `data` (this name is required)
4. Download all zip files from Flickr (photos + account data) and unpack it into your `flickr/data` directory
5. Open console, go to the `flickr` directory  
6. Run: 
    ``` 
    npx flickr-data-organizer
    ```
7. `export` directory will be created with your albums and photos
8. Cleanup: Move albums in `export`, delete `data` directory to free disk space 


Future development
------------------
As I'm busy, I have no plans from my side. Feel free to fork it and make it much better. :)