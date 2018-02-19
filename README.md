# Playlistify

THIS APPLICATION IS STILL UNDER DEVELOPMENT AND IS NOT FULLY FUNCTIONAL YET. <br>
Playlistify allows playlists creation or update with albums extracted from Sputnikmusic.com (New Releases)

# FEATURES

- Extraction of new releases using web scrapping in Python of the page https://www.sputnikmusic.com/newreleases.php (script to be added)<br>
- Saving albums extracted to MongoDB<br> (To be automatized)
- Display a page with album extracted from Sputnik Music (To be udpdated)<br>
- Search extracted albums in Spotify using Spotify API (Not fully functional)<br>
- Authentication against spotify<br>
- Add album to an existing or new user's playlist (To be developped)<br>

# Application Architecture
## Back-End : 
Directory: ./server
- NODE JS
- EXPRESS
- MONGODB

### Run Back-end
nodemon ./server/bin/www

## Front-End : 
Directory: ./src
 - Angular 5
 - Boostrap 4
 
### Build Front-End
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.





