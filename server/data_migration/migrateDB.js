// Getting Album Model
var Album = require('../models/album.model');
var mongoose = require('mongoose');
var bluebird = require('bluebird');

async function migrateData () {
  mongoose.Promise = bluebird;
  await mongoose.connect("mongodb://127.0.0.1:27017/playlistifyApp",  { useNewUrlParser: true })
  .then(()=> { console.log(`Succesfully Connected to the Mongodb Database`);})
  .catch(()=> { console.log(`Error Connecting to the Mongodb Database`);});
  const dbPlaylistify = mongoose.connection;

try {
    var albums = await Album.find();
    var count = await Album.countDocuments();


    for (let album of albums) {
      console.log(album._id);

      if (album.sputnikMusic.note){
        album.sputnikMusic.note = parseFloat(album.sputnikMusic.note);
      }

      album.sortDate = await setSortDate(album);


      var savedAlbum = await album.save();


    };

    await mongoose.disconnect();


    // Return the albums list with the appropriate HTTP Status Code and Message.
  } catch (e) {
    console.log(e);
  }
}

async function setSortDate(album) {
  try {
    return new Promise(resolve => {
      sortDate_ = {};

      if (album.created && !album.sortDate.day){
        createdDate = new Date(album.created);
        month_ = createdDate.getMonth()+1;
        year_ = createdDate.getFullYear();
        day_ = createdDate.getDate();
        // console.log(day_);
        // console.log(month_);
        // console.log(year_);
        sortDate_ = {
          day: parseInt(day_),
          month: parseInt(month_),
          year: parseInt(year_)
        };

      } else if (album.sputnikMusic.releaseDate && !album.sortDate.day){
        // console.log("Sputnkik Release Date\n");
        sortDate_ = {
            day: 1,
            month: parseInt(album.sputnikMusic.releaseDate.month),
            year: parseInt(album.sputnikMusic.releaseDate.year)
        };

      } else {
        console.log("object ID: %s", album._id);
        resolve(album.sortDate);
      }

      resolve(sortDate_);

    })
  } catch (error) {
    console.log(error);
  }
}

migrateData();
