# Playlistify
## Why this application 
I’m a music addict — always diving into obscure review sites to discover new artists and hidden gems.
The problem? Every time I found a great album, I had to jump between tabs to add it manually to my Spotify playlist. Way too long for something meant to be fun.

So, I turned that frustration into a challenge.
As a former engineer turned product manager, I wanted to see if I could still build something from scratch.

The idea was simple: create an app that extracts album data from the review sites I browse, stores them neatly, and lets me add them to Spotify in just one click.

It wasn’t a weekend hack — it was years in the making, built piece by piece whenever I found the time.
But I stuck with it, learned along the way, and eventually shipped it.
It’s not a professional-grade product, but it works, it's mine — and it reminded me how much I love building things that solve problems. 


# FEATURES

- Extraction of new releases using web scrapping in Python of the pages of some of my favorite music sites or blogs<br>
- Saving albums extracted to MongoDB<br>
- Display a page with album extracted from Sputnik Music<br>
- Search extracted albums in Spotify using Spotify API (Not fully functional)<br>
- Authentication against spotify<br>
- Add album to an existing or new user's playlist (Not fully functional)<br>

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
 - Angular 
 - Boostrap 
 
### Build Front-End
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.





