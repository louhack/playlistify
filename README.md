# Playlistify

THIS APPLICATION IS STILL UNDER DEVELOPMENT AND IS NOT FULLY FUNCTIONAL YET.
Playlistify allows playlist creation with albums webscrapped from Sputnikmusic.com

# FEATURES

Extraction of new releases using geb scrapping in Python of https://www.sputnikmusic.com/newreleases.php (script to be added)
Saving albums extracted to MongoDB
Display a page with album extracted from Sputnik Music
Search extracted albums in Spotify using Spotify API
Authentication against spotify
Add album to an existing or new user's playlist

# Application Architecture
## Back-End : ./server
- NODE JS
- EXPRESS
- MONGODB

### Run Back-end
nodemon ./server/www

## Front-End : ./src
 - Angular 5
 - Boostrap 4
 
### Build Front-End

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.





