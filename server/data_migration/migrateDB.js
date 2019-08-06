// Getting Album Model
var Album = require('../models/album.model');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
require('dotenv-safe').load();

const config = require('config');

async function migrateData () {
  mongoose.Promise = bluebird;
  await mongoose.connect(config.get('Database.host'),  { useNewUrlParser: true })
  .then(()=> { console.log(`Succesfully Connected to the Mongodb Database`);})
  .catch(()=> { console.log(`Error Connecting to the Mongodb Database`);});
  const dbPlaylistify = mongoose.connection;

try {
    var albums = await Album.find();
    // var album = await Album.findById("5a981206b4ffc6be9e577ec1");
    // var count = await Album.countDocuments();
    var g_counter = albums.length;
    // var g_counter = 1;
    var createdDateCounter = 0;
    var sptnMCounter = 0;
    var noSetSortDate = 0;

    for (let album of albums) {
     // console.log("Check : " + album._id);
      // g_counter++;

      if (album.sputnikMusic.note){
        // console.log("update note : %s", typeof album.sputnikMusic.note);
        // note = new String(album.sputnikMusic.note)
        album.sputnikMusic.note = parseFloat(album.sputnikMusic.note);
        // console.log("update note : %s", typeof album.sputnikMusic.note);
      }

      resolution = await setSortDate(album);

      if(resolution[0] === 1) {
        album.sortDate = resolution[1];
        createdDateCounter++;
      }
      else if (resolution[0] === 2) {
        album.sortDate = resolution[1];
        sptnMCounter++;

      }
      else {
        noSetSortDate++;
      }

      var savedAlbum = await Album.replaceOne({_id:album._id}, album);
      // console.log(savedAlbum);


    };


    console.log("Records found : " + g_counter)
    console.log("Records set with creation date : " + createdDateCounter);
    console.log("Records set with sputnik date : " + sptnMCounter);
    console.log("Records with no date set : " + noSetSortDate);

    await mongoose.disconnect();


    // Return the albums list with the appropriate HTTP Status Code and Message.
  } catch (e) {
    console.log(e);
  }
}

async function setSortDate(album) {
  try {
    return new Promise(resolve => {
      resolution = 0;
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
        resolution = 1;

      } else if (album.sputnikMusic.releaseDate && !album.sortDate.day){
        // console.log("Sputnkik Release Date\n");
        sortDate_ = {
            day: 1,
            month: parseInt(album.sputnikMusic.releaseDate.month),
            year: parseInt(album.sputnikMusic.releaseDate.year)
        };
        resolution = 2;

      } else {
        //console.log("No setSortDate : %s", album._id);
        resolution = 3;
        resolve([resolution, album.sortDate]);
      }

      resolve([resolution, sortDate_]);

    })
  } catch (error) {
    console.log(error);
  }
}

migrateData();
