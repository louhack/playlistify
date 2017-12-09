var mongoose = require("mongoose");
var Album = require("../models/album.model");

var data = [
    {
        "idAlbumSputnik": "268871",
        "artistName": "Tom Rogerson with Brian Eno",
        "albumName": "Finding Shore",
        "note": "4.2",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268871.jpg"
    },
    {
        "idAlbumSputnik": "268327",
        "artistName": "Glassjaw",
        "albumName": "Material Control",
        "note": "4.1",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268327.jpg"
    },
    {
        "idAlbumSputnik": "262034",
        "artistName": "The Dear Hunter",
        "albumName": "All Is As All Should Be",
        "note": "4.0",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262034.jpg"
    },
    {
        "idAlbumSputnik": "263635",
        "artistName": "Icarus the Owl",
        "albumName": "Rearm Circuits",
        "note": "3.9",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263635.jpg"
    },
    {
        "idAlbumSputnik": "266537",
        "artistName": "Story of the Year",
        "albumName": "Wolves",
        "note": "3.8",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266537.jpg"
    },
    {
        "idAlbumSputnik": "265845",
        "artistName": "Chris Stapleton",
        "albumName": "From A Room: Volume 2",
        "note": "3.8",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265845.jpg"
    },
    {
        "idAlbumSputnik": "270273",
        "artistName": "Belle and Sebastian",
        "albumName": "How To Solve Our Human Problems Pt. 1",
        "note": "3.7",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270273.jpg"
    },
    {
        "idAlbumSputnik": "264829",
        "artistName": "War of Ages",
        "albumName": "Alpha",
        "note": "3.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264829.jpg"
    },
    {
        "idAlbumSputnik": "264258",
        "artistName": "Morbid Angel",
        "albumName": "Kingdoms Disdained",
        "note": "3.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264258.jpg"
    },
    {
        "idAlbumSputnik": "269157",
        "artistName": "Juicy J",
        "albumName": "Rubba Band Business: The Album",
        "note": "3.3",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269157.jpg"
    },
    {
        "idAlbumSputnik": "267110",
        "artistName": "Miguel",
        "albumName": "War and Leisure",
        "note": "3.3",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267110.jpg"
    },
    {
        "idAlbumSputnik": "268092",
        "artistName": "Intervals",
        "albumName": "The Way Forward",
        "note": "3.3",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268092.jpg"
    },
    {
        "idAlbumSputnik": "268320",
        "artistName": "Prurient",
        "albumName": "Rainbow Mirror",
        "note": "3.3",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268320.jpg"
    },
    {
        "idAlbumSputnik": "252610",
        "artistName": "Diablo Swing Orchestra",
        "albumName": "Pacifisticuffs",
        "note": "3.2",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/252610.jpg"
    },
    {
        "idAlbumSputnik": "268757",
        "artistName": "Eldamar",
        "albumName": "A Dark Forgotten Past",
        "note": "3.2",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268757.jpg"
    },
    {
        "idAlbumSputnik": "266610",
        "artistName": "The Faceless",
        "albumName": "In Becoming a Ghost",
        "note": "3.1",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266610.jpg"
    },
    {
        "idAlbumSputnik": "268075",
        "artistName": "Chief Keef",
        "albumName": "Dedication",
        "note": "2.9",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268075.jpg"
    },
    {
        "idAlbumSputnik": "267113",
        "artistName": "Neil Young",
        "albumName": "The Visitor",
        "note": "2.8",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267113.jpg"
    },
    {
        "idAlbumSputnik": "267029",
        "artistName": "U2",
        "albumName": "Songs of Experience",
        "note": "2.7",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267029.jpg"
    },
    {
        "idAlbumSputnik": "270012",
        "artistName": "Big Sean and Metro Boomin",
        "albumName": "Double Or Nothing",
        "note": "2.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270012.jpg"
    },
    {
        "idAlbumSputnik": "266486",
        "artistName": "Five Finger Death Punch",
        "albumName": "A Decade of Destruction",
        "note": "1.7",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266486.jpg"
    },
    {
        "idAlbumSputnik": "269739",
        "artistName": "Jake Paul and Team 10",
        "albumName": "Litmas",
        "note": "1.2",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269739.jpg"
    },
    {
        "idAlbumSputnik": "256723",
        "artistName": "Blood on the Dance Floor",
        "albumName": "Kawaii Monster",
        "note": "1.0",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/256723.jpg"
    },
    {
        "idAlbumSputnik": "266090",
        "artistName": "Charlotte Gainsbourg",
        "albumName": "Rest",
        "note": "4.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266090.jpg"
    },
    {
        "idAlbumSputnik": "268540",
        "artistName": "Degial",
        "albumName": "Predator Reign",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268540.jpg"
    },
    {
        "idAlbumSputnik": "262637",
        "artistName": "Iron Maiden",
        "albumName": "The Book of Souls: Live Chapter",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262637.jpg"
    },
    {
        "idAlbumSputnik": "259476",
        "artistName": "Converge",
        "albumName": "The Dusk in Us",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259476.jpg"
    },
    {
        "idAlbumSputnik": "268445",
        "artistName": "Black Sabbath",
        "albumName": "The End (Live)",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268445.jpg"
    },
    {
        "idAlbumSputnik": "267802",
        "artistName": "Hail the Sun",
        "albumName": "Secret Wars",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267802.jpg"
    },
    {
        "idAlbumSputnik": "268192",
        "artistName": "The Dark Element",
        "albumName": "The Dark Element",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268192.jpg"
    },
    {
        "idAlbumSputnik": "263544",
        "artistName": "Godflesh",
        "albumName": "Post Self",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263544.jpg"
    },
    {
        "idAlbumSputnik": "267426",
        "artistName": "Thantifaxath",
        "albumName": "Void Masquerading as Matter",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267426.jpg"
    },
    {
        "idAlbumSputnik": "267217",
        "artistName": "Name",
        "albumName": ".â.â.âYou Are Mostly Nowhere",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267217.jpg"
    },
    {
        "idAlbumSputnik": "268271",
        "artistName": "King Gizzard and The Lizard Wizard",
        "albumName": "Polygondwanaland",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268271.jpg"
    },
    {
        "idAlbumSputnik": "267462",
        "artistName": "James Holden and The Animal Spirits",
        "albumName": "The Animal Spirits",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267462.jpg"
    },
    {
        "idAlbumSputnik": "268585",
        "artistName": "Gleemer",
        "albumName": "Anymore",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268585.jpg"
    },
    {
        "idAlbumSputnik": "265728",
        "artistName": "Desolate Shrine",
        "albumName": "Deliverance From The Godless Void",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265728.jpg"
    },
    {
        "idAlbumSputnik": "262852",
        "artistName": "Angel Olsen",
        "albumName": "Phases",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262852.jpg"
    },
    {
        "idAlbumSputnik": "267112",
        "artistName": "Count to Altek",
        "albumName": "She Will Fly With You Forever",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267112.jpg"
    },
    {
        "idAlbumSputnik": "264506",
        "artistName": "Adimiron",
        "albumName": "Et Liber Eris",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264506.jpg"
    },
    {
        "idAlbumSputnik": "268679",
        "artistName": "Death Toll 80k",
        "albumName": "Step Down",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268679.jpg"
    },
    {
        "idAlbumSputnik": "263047",
        "artistName": "Cavalera Conspiracy",
        "albumName": "Psychosis",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263047.jpg"
    },
    {
        "idAlbumSputnik": "259177",
        "artistName": "The Unguided",
        "albumName": "And The Battle Royale",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259177.jpg"
    },
    {
        "idAlbumSputnik": "269020",
        "artistName": "Hollow Prophet",
        "albumName": "Hellhole",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269020.jpg"
    },
    {
        "idAlbumSputnik": "267118",
        "artistName": "Sharon Jones and the Dap-Kings",
        "albumName": "Soul Of A Woman",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267118.jpg"
    },
    {
        "idAlbumSputnik": "269064",
        "artistName": "Aetherian",
        "albumName": "The Untamed Wilderness",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269064.jpg"
    },
    {
        "idAlbumSputnik": "264059",
        "artistName": "Beast In Black",
        "albumName": "Berserker",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264059.jpg"
    },
    {
        "idAlbumSputnik": "260494",
        "artistName": "Moonspell",
        "albumName": "1755",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260494.jpg"
    },
    {
        "idAlbumSputnik": "268584",
        "artistName": "Chaos Moon",
        "albumName": "Eschaton MÃ©moire",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268584.jpg"
    },
    {
        "idAlbumSputnik": "267049",
        "artistName": "Polaris (AUS)",
        "albumName": "The Mortal Coil",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267049.jpg"
    },
    {
        "idAlbumSputnik": "265779",
        "artistName": "YLVA",
        "albumName": "M E T A",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265779.jpg"
    },
    {
        "idAlbumSputnik": "267138",
        "artistName": "Blaze of Perdition",
        "albumName": "Conscious Darkness",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267138.jpg"
    },
    {
        "idAlbumSputnik": "268511",
        "artistName": "Ghost Atlas",
        "albumName": "All Is In Sync, and There's Nothing Left to Sing",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268511.jpg"
    },
    {
        "idAlbumSputnik": "262223",
        "artistName": "Zao",
        "albumName": "Pyrrhic Victory",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262223.jpg"
    },
    {
        "idAlbumSputnik": "258990",
        "artistName": "The Body and Full Of Hell",
        "albumName": "Ascending a Mountain of Heavy Light",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/258990.jpg"
    },
    {
        "idAlbumSputnik": "269451",
        "artistName": "The Burial of You and Me",
        "albumName": "Closure",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269451.jpg"
    },
    {
        "idAlbumSputnik": "268069",
        "artistName": "Langhorne Slim",
        "albumName": "Lost At Last, Vol 1",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268069.jpg"
    },
    {
        "idAlbumSputnik": "259944",
        "artistName": "Quicksand",
        "albumName": "Interiors",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259944.jpg"
    },
    {
        "idAlbumSputnik": "268853",
        "artistName": "Krallice",
        "albumName": "Go Be Forgotten",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268853.jpg"
    },
    {
        "idAlbumSputnik": "267963",
        "artistName": "Gatecreeper",
        "albumName": "Sweltering Madness",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267963.jpg"
    },
    {
        "idAlbumSputnik": "267338",
        "artistName": "Aosoth",
        "albumName": "V: The Inside Scriptures",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267338.jpg"
    },
    {
        "idAlbumSputnik": "266701",
        "artistName": "Causa Sui",
        "albumName": "Vibraciones Doradas",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266701.jpg"
    },
    {
        "idAlbumSputnik": "267591",
        "artistName": "Armand Hammer",
        "albumName": "Rome",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267591.jpg"
    },
    {
        "idAlbumSputnik": "261299",
        "artistName": "Cannibal Corpse",
        "albumName": "Red Before Black",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261299.jpg"
    },
    {
        "idAlbumSputnik": "261338",
        "artistName": "Entheos (USA)",
        "albumName": "Dark Future",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261338.jpg"
    },
    {
        "idAlbumSputnik": "267024",
        "artistName": "Bibio",
        "albumName": "Phantom Brickworks",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267024.jpg"
    },
    {
        "idAlbumSputnik": "267004",
        "artistName": "Yaeji",
        "albumName": "EP2",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267004.jpg"
    },
    {
        "idAlbumSputnik": "268547",
        "artistName": "Almyrkvi",
        "albumName": "Umbra",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268547.jpg"
    },
    {
        "idAlbumSputnik": "267301",
        "artistName": "Avalon Emerson",
        "albumName": "Whities 013",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267301.jpg"
    },
    {
        "idAlbumSputnik": "267219",
        "artistName": "Scour",
        "albumName": "Red",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267219.jpg"
    },
    {
        "idAlbumSputnik": "268021",
        "artistName": "Ulver",
        "albumName": "Sic Transit Gloria Mundi",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268021.jpg"
    },
    {
        "idAlbumSputnik": "266919",
        "artistName": "Bjork",
        "albumName": "Utopia",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266919.jpg"
    },
    {
        "idAlbumSputnik": "263071",
        "artistName": "Threat Signal",
        "albumName": "Disconnect",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263071.jpg"
    },
    {
        "idAlbumSputnik": "267153",
        "artistName": "Cruciamentum",
        "albumName": "Paradise Envenomed",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267153.jpg"
    },
    {
        "idAlbumSputnik": "268091",
        "artistName": "Phinehas",
        "albumName": "Dark Flag",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268091.jpg"
    },
    {
        "idAlbumSputnik": "268518",
        "artistName": "Bird Problems",
        "albumName": "TAR",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268518.jpg"
    },
    {
        "idAlbumSputnik": "260562",
        "artistName": "Dan Terminus",
        "albumName": "Automated Refrains",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260562.jpg"
    },
    {
        "idAlbumSputnik": "268538",
        "artistName": "DJ Richard",
        "albumName": "Path of Ruin",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268538.jpg"
    },
    {
        "idAlbumSputnik": "267908",
        "artistName": "Merkabah (PL)",
        "albumName": "Million Miles",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267908.jpg"
    },
    {
        "idAlbumSputnik": "267916",
        "artistName": "Death of Lovers",
        "albumName": "The Acrobat",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267916.jpg"
    },
    {
        "idAlbumSputnik": "268522",
        "artistName": "Tame Impala",
        "albumName": "Currents B-Sides & Remixes",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268522.jpg"
    },
    {
        "idAlbumSputnik": "269204",
        "artistName": "Sufjan Stevens",
        "albumName": "The Greatest Gift",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269204.jpg"
    },
    {
        "idAlbumSputnik": "267651",
        "artistName": "DJ Seinfeld",
        "albumName": "Time Spent Away From U",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267651.jpg"
    },
    {
        "idAlbumSputnik": "267996",
        "artistName": "Call Super",
        "albumName": "Arpo",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267996.jpg"
    },
    {
        "idAlbumSputnik": "265227",
        "artistName": "Signs of the Swarm",
        "albumName": "The Disfigurement Of Existence",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265227.jpg"
    },
    {
        "idAlbumSputnik": "263619",
        "artistName": "Taake",
        "albumName": "Kong Vinter",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263619.jpg"
    },
    {
        "idAlbumSputnik": "261438",
        "artistName": "Like Moths to Flames",
        "albumName": "Dark Divine",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261438.jpg"
    },
    {
        "idAlbumSputnik": "268650",
        "artistName": "ESPRIT",
        "albumName": "200% Electronica",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268650.jpg"
    },
    {
        "idAlbumSputnik": "262693",
        "artistName": "Backtrack",
        "albumName": "Bad To My World",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262693.jpg"
    },
    {
        "idAlbumSputnik": "264821",
        "artistName": "Sleigh Bells",
        "albumName": "Kid Kruschev",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264821.jpg"
    },
    {
        "idAlbumSputnik": "268824",
        "artistName": "Teen Daze",
        "albumName": "Themes for a New Earth",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268824.jpg"
    },
    {
        "idAlbumSputnik": "268557",
        "artistName": "Emancipator",
        "albumName": "Baralku",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268557.jpg"
    },
    {
        "idAlbumSputnik": "268643",
        "artistName": "Cryptodira",
        "albumName": "The Devil's Despair",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268643.jpg"
    },
    {
        "idAlbumSputnik": "267947",
        "artistName": "Your Memorial",
        "albumName": "Your Memorial",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267947.jpg"
    },
    {
        "idAlbumSputnik": "262767",
        "artistName": "Baths",
        "albumName": "Romaplasm",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262767.jpg"
    },
    {
        "idAlbumSputnik": "263628",
        "artistName": "Noel Gallagher's High Flying Birds",
        "albumName": "Who Built the Moon?",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263628.jpg"
    },
    {
        "idAlbumSputnik": "261619",
        "artistName": "Stereophonics",
        "albumName": "Scream Above the Sounds",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261619.jpg"
    },
    {
        "idAlbumSputnik": "266681",
        "artistName": "TOOTHGRINDER",
        "albumName": "Phantom Amour",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266681.jpg"
    },
    {
        "idAlbumSputnik": "261983",
        "artistName": "Husker Du",
        "albumName": "Savage Young DÃ¼",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261983.jpg"
    },
    {
        "idAlbumSputnik": "268817",
        "artistName": "At the Drive-In",
        "albumName": "DiamantÃ©",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268817.jpg"
    },
    {
        "idAlbumSputnik": "265665",
        "artistName": "Speak the Truth... Even if Your Voice Shakes",
        "albumName": "Everyone You Love Will Slip Away From You",
        "note": "3.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265665.jpg"
    },
    {
        "idAlbumSputnik": "262829",
        "artistName": "Yung Lean",
        "albumName": "Stranger",
        "note": "3.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262829.jpg"
    },
    {
        "idAlbumSputnik": "262108",
        "artistName": "Audn",
        "albumName": "Farvegir Fyrndar",
        "note": "3.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262108.jpg"
    },
    {
        "idAlbumSputnik": "265167",
        "artistName": "My Enemies and I",
        "albumName": "The Beast Inside",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265167.jpg"
    },
    {
        "idAlbumSputnik": "268885",
        "artistName": "Equiknoxx",
        "albumName": "ColÃ³n Man",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268885.jpg"
    },
    {
        "idAlbumSputnik": "267805",
        "artistName": "Greta Van Fleet",
        "albumName": "From the Fires",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267805.jpg"
    },
    {
        "idAlbumSputnik": "261869",
        "artistName": "Annihilator",
        "albumName": "For the Demented",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261869.jpg"
    },
    {
        "idAlbumSputnik": "264255",
        "artistName": "Sam Smith",
        "albumName": "The Thrill of It All",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264255.jpg"
    },
    {
        "idAlbumSputnik": "267445",
        "artistName": "Tove Lo",
        "albumName": "Blue Lips",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267445.jpg"
    },
    {
        "idAlbumSputnik": "268519",
        "artistName": "Jaden Smith",
        "albumName": "Syre",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268519.jpg"
    },
    {
        "idAlbumSputnik": "264832",
        "artistName": "Green Day",
        "albumName": "God's Favorite Band",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264832.jpg"
    },
    {
        "idAlbumSputnik": "259591",
        "artistName": "Anti-Flag",
        "albumName": "American Fall",
        "note": "2.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259591.jpg"
    },
    {
        "idAlbumSputnik": "267736",
        "artistName": "Burial",
        "albumName": "Pre Dawn/Indoors",
        "note": "2.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267736.jpg"
    },
    {
        "idAlbumSputnik": "265718",
        "artistName": "Evanescence",
        "albumName": "Synthesis",
        "note": "2.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265718.jpg"
    },
    {
        "idAlbumSputnik": "263468",
        "artistName": "Walk the Moon",
        "albumName": "What If Nothing",
        "note": "2.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263468.jpg"
    },
    {
        "idAlbumSputnik": "268348",
        "artistName": "Eluvium",
        "albumName": "Shuffle Drones",
        "note": "2.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268348.jpg"
    },
    {
        "idAlbumSputnik": "261371",
        "artistName": "Electric Wizard",
        "albumName": "Wizard Bloody Wizard",
        "note": "2.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261371.jpg"
    },
    {
        "idAlbumSputnik": "268076",
        "artistName": "Cyhi The Prynce",
        "albumName": "No Dope On Sundays",
        "note": "2.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268076.jpg"
    },
    {
        "idAlbumSputnik": "267069",
        "artistName": "Joji",
        "albumName": "In Tongues",
        "note": "2.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267069.jpg"
    },
    {
        "idAlbumSputnik": "267478",
        "artistName": "Lustre",
        "albumName": "Still Innocence",
        "note": "2.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267478.jpg"
    },
    {
        "idAlbumSputnik": "265490",
        "artistName": "Wiz Khalifa",
        "albumName": "Laugh Now, Fly Later",
        "note": "2.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265490.jpg"
    },
    {
        "idAlbumSputnik": "267098",
        "artistName": "Hopsin",
        "albumName": "No Shame",
        "note": "2.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267098.jpg"
    },
    {
        "idAlbumSputnik": "260101",
        "artistName": "Taylor Swift",
        "albumName": "Reputation",
        "note": "2.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260101.jpg"
    },
    {
        "idAlbumSputnik": "262625",
        "artistName": "Morrissey",
        "albumName": "Low In High School",
        "note": "2.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262625.jpg"
    },
    {
        "idAlbumSputnik": "268550",
        "artistName": "Blackbear",
        "albumName": "cybersex",
        "note": "2.1",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268550.jpg"
    },
    {
        "idAlbumSputnik": "267023",
        "artistName": "Black Malachite",
        "albumName": "Torn Soul",
        "note": "2.1",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267023.jpg"
    },
    {
        "idAlbumSputnik": "265319",
        "artistName": "Sia",
        "albumName": "Everyday Is Christmas",
        "note": "2.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265319.jpg"
    },
    {
        "idAlbumSputnik": "261989",
        "artistName": "Shamir",
        "albumName": "Revelations",
        "note": "2.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261989.jpg"
    },
    {
        "idAlbumSputnik": "267464",
        "artistName": "Fieldy",
        "albumName": "Bassically",
        "note": "1.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267464.jpg"
    },
    {
        "idAlbumSputnik": "266344",
        "artistName": "Kid Rock",
        "albumName": "Sweet Southern Sugar",
        "note": "1.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266344.jpg"
    },
    {
        "idAlbumSputnik": "248401",
        "artistName": "Iggy Azalea",
        "albumName": "Digital Distortion",
        "note": "1.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/248401.jpg"
    },
    {
        "idAlbumSputnik": "264185",
        "artistName": "Maroon 5",
        "albumName": "Red Pill Blues",
        "note": "1.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264185.jpg"
    },
    {
        "idAlbumSputnik": "268560",
        "artistName": "In Flames",
        "albumName": "Down, Wicked and No Good",
        "note": "1.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268560.jpg"
    },
    {
        "idAlbumSputnik": "247799",
        "artistName": "Snide Remarks",
        "albumName": "Anything But Casual",
        "note": "1.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/247799.jpg"
    },
    {
        "idAlbumSputnik": "259986",
        "artistName": "John Carpenter",
        "albumName": "Anthology: Movie Themes 1974-1998",
        "note": "4.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259986.jpg"
    },
    {
        "idAlbumSputnik": "265916",
        "artistName": "Turnpike Troubadours",
        "albumName": "A Long Way From Your Heart",
        "note": "4.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265916.jpg"
    },
    {
        "idAlbumSputnik": "264819",
        "artistName": "Hans Zimmer and Benjamin Wallfisch",
        "albumName": "Blade Runner 2049",
        "note": "4.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264819.jpg"
    },
    {
        "idAlbumSputnik": "264684",
        "artistName": "Toby Driver",
        "albumName": "Live at Roulette, March 2017",
        "note": "4.0",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264684.jpg"
    },
    {
        "idAlbumSputnik": "265815",
        "artistName": "Christian Scott",
        "albumName": "The Emancipation Procrastination",
        "note": "4.0",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265815.jpg"
    },
    {
        "idAlbumSputnik": "269891",
        "artistName": "Small Leaks Sink Ships",
        "albumName": "Golden Calf",
        "note": "4.0",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269891.jpg"
    },
    {
        "idAlbumSputnik": "264768",
        "artistName": "Ninja Sex Party",
        "albumName": "Under The Covers 2",
        "note": "4.0",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264768.jpg"
    },
    {
        "idAlbumSputnik": "265567",
        "artistName": "Malokarpatan",
        "albumName": "Nordkarpatenland",
        "note": "4.0",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265567.jpg"
    },
    {
        "idAlbumSputnik": "259543",
        "artistName": "Julien Baker",
        "albumName": "Turn Out The Lights",
        "note": "4.0",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259543.jpg"
    },
    {
        "idAlbumSputnik": "265777",
        "artistName": "Wobbler",
        "albumName": "From Silence to Somewhere",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265777.jpg"
    },
    {
        "idAlbumSputnik": "257980",
        "artistName": "Ne Obliviscaris",
        "albumName": "Urn",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/257980.jpg"
    },
    {
        "idAlbumSputnik": "261569",
        "artistName": "Amenra",
        "albumName": "Mass VI",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261569.jpg"
    },
    {
        "idAlbumSputnik": "267060",
        "artistName": "KirbLaGoop",
        "albumName": "Goop World",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267060.jpg"
    },
    {
        "idAlbumSputnik": "265639",
        "artistName": "Xanthochroid",
        "albumName": "Of Erthe and Axen: Act II",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265639.jpg"
    },
    {
        "idAlbumSputnik": "263873",
        "artistName": "Bones",
        "albumName": "Failure",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263873.jpg"
    },
    {
        "idAlbumSputnik": "264124",
        "artistName": "Major Parkinson",
        "albumName": "Blackbox",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264124.jpg"
    },
    {
        "idAlbumSputnik": "259030",
        "artistName": "Enslaved",
        "albumName": "E",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259030.jpg"
    },
    {
        "idAlbumSputnik": "264243",
        "artistName": "Big K.R.I.T.",
        "albumName": "4eva Is a Mighty Long Time",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264243.jpg"
    },
    {
        "idAlbumSputnik": "266305",
        "artistName": "HEIR",
        "albumName": "Au peuple de l'abÃ®me",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266305.jpg"
    },
    {
        "idAlbumSputnik": "258548",
        "artistName": "The Black Dahlia Murder",
        "albumName": "Nightbringers",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/258548.jpg"
    },
    {
        "idAlbumSputnik": "259717",
        "artistName": "Lunatic Soul",
        "albumName": "Fractured",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259717.jpg"
    },
    {
        "idAlbumSputnik": "262943",
        "artistName": "CunninLynguists",
        "albumName": "Rose Azura Njano",
        "note": "3.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262943.jpg"
    },
    {
        "idAlbumSputnik": "263178",
        "artistName": "Spectral Voice",
        "albumName": "Eroded Corridors of Unbeing",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263178.jpg"
    },
    {
        "idAlbumSputnik": "258068",
        "artistName": "August Burns Red",
        "albumName": "Phantom Anthem",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/258068.jpg"
    },
    {
        "idAlbumSputnik": "264968",
        "artistName": "Midnight",
        "albumName": "Sweet Death and Ecstasy",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264968.jpg"
    },
    {
        "idAlbumSputnik": "266586",
        "artistName": "MO",
        "albumName": "When I Was Young",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266586.jpg"
    },
    {
        "idAlbumSputnik": "261982",
        "artistName": "King Krule",
        "albumName": "The OOZ",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261982.jpg"
    },
    {
        "idAlbumSputnik": "260155",
        "artistName": "Trivium",
        "albumName": "The Sin and the Sentence",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260155.jpg"
    },
    {
        "idAlbumSputnik": "267537",
        "artistName": "Inconcessus Lux Lucis",
        "albumName": "The Crowning Quietus",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267537.jpg"
    },
    {
        "idAlbumSputnik": "266518",
        "artistName": "Rina Sawayama",
        "albumName": "RINA",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266518.jpg"
    },
    {
        "idAlbumSputnik": "265926",
        "artistName": "Throane",
        "albumName": "Plus Une Main A Mordre",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265926.jpg"
    },
    {
        "idAlbumSputnik": "264836",
        "artistName": "Gruntruck",
        "albumName": "Gruntruck",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264836.jpg"
    },
    {
        "idAlbumSputnik": "263044",
        "artistName": "Hallatar",
        "albumName": "No Stars Upon the Bridge",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263044.jpg"
    },
    {
        "idAlbumSputnik": "264956",
        "artistName": "Iron Chic",
        "albumName": "You Can't Stay Here",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264956.jpg"
    },
    {
        "idAlbumSputnik": "259034",
        "artistName": "Bell Witch",
        "albumName": "Mirror Reaper",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259034.jpg"
    },
    {
        "idAlbumSputnik": "265796",
        "artistName": "Cheem",
        "albumName": "Downhill",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265796.jpg"
    },
    {
        "idAlbumSputnik": "267645",
        "artistName": "Kardashev",
        "albumName": "The Almanac",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267645.jpg"
    },
    {
        "idAlbumSputnik": "265805",
        "artistName": "Iron Monkey",
        "albumName": "9-13",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265805.jpg"
    },
    {
        "idAlbumSputnik": "264466",
        "artistName": "Movements",
        "albumName": "Feel Something",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264466.jpg"
    },
    {
        "idAlbumSputnik": "258630",
        "artistName": "Kelela",
        "albumName": "Take Me Apart",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/258630.jpg"
    },
    {
        "idAlbumSputnik": "261947",
        "artistName": "Thousand Below",
        "albumName": "The Love You Let Too Close",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261947.jpg"
    },
    {
        "idAlbumSputnik": "265758",
        "artistName": "Redshift Pilots",
        "albumName": "Moonlight Synthesis",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265758.jpg"
    },
    {
        "idAlbumSputnik": "266963",
        "artistName": "L'Orange",
        "albumName": "The Ordinary Man",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266963.jpg"
    },
    {
        "idAlbumSputnik": "263632",
        "artistName": "Yellow Eyes",
        "albumName": "Immersion Trench Reverie",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263632.jpg"
    },
    {
        "idAlbumSputnik": "256962",
        "artistName": "Citizen",
        "albumName": "As You Please",
        "note": "3.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/256962.jpg"
    },
    {
        "idAlbumSputnik": "263715",
        "artistName": "Street Sects",
        "albumName": "Rat Jacket",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263715.jpg"
    },
    {
        "idAlbumSputnik": "259160",
        "artistName": "Lo!",
        "albumName": "Vestigial",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259160.jpg"
    },
    {
        "idAlbumSputnik": "260491",
        "artistName": "Dreadnought",
        "albumName": "A Wake In Sacred Waves",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260491.jpg"
    },
    {
        "idAlbumSputnik": "265765",
        "artistName": "Circuit Des Yeux",
        "albumName": "Reaching For Indigo",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265765.jpg"
    },
    {
        "idAlbumSputnik": "265793",
        "artistName": "Acid Witch",
        "albumName": "Evil Sound Screamers",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265793.jpg"
    },
    {
        "idAlbumSputnik": "264941",
        "artistName": "Young Dolph",
        "albumName": "Thinking Out Loud",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264941.jpg"
    },
    {
        "idAlbumSputnik": "267052",
        "artistName": "Daniele Luppi and Parquet Courts",
        "albumName": "Milano",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267052.jpg"
    },
    {
        "idAlbumSputnik": "260303",
        "artistName": "Stick To Your Guns",
        "albumName": "True View",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260303.jpg"
    },
    {
        "idAlbumSputnik": "266466",
        "artistName": "Left Behind",
        "albumName": "Blessed by the Burn",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266466.jpg"
    },
    {
        "idAlbumSputnik": "264686",
        "artistName": "Airiel",
        "albumName": "Molten Young Lovers",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264686.jpg"
    },
    {
        "idAlbumSputnik": "261154",
        "artistName": "Hanging Garden",
        "albumName": "I Am Become",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261154.jpg"
    },
    {
        "idAlbumSputnik": "259451",
        "artistName": "Primitive Man",
        "albumName": "Caustic",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259451.jpg"
    },
    {
        "idAlbumSputnik": "259465",
        "artistName": "Power Quest",
        "albumName": "Sixth Dimension",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259465.jpg"
    },
    {
        "idAlbumSputnik": "263874",
        "artistName": "All Pigs Must Die",
        "albumName": "Hostage Animal",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263874.jpg"
    },
    {
        "idAlbumSputnik": "259850",
        "artistName": "And So I Watch You From Afar",
        "albumName": "The Endless Shimmering",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259850.jpg"
    },
    {
        "idAlbumSputnik": "261285",
        "artistName": "Sorcerer",
        "albumName": "The Crowning of the Fire King",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261285.jpg"
    },
    {
        "idAlbumSputnik": "260067",
        "artistName": "Robert Plant",
        "albumName": "Carry Fire",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260067.jpg"
    },
    {
        "idAlbumSputnik": "264293",
        "artistName": "Spirit Adrift",
        "albumName": "Curse of Conception",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264293.jpg"
    },
    {
        "idAlbumSputnik": "262061",
        "artistName": "Altarage",
        "albumName": "Endinghent",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262061.jpg"
    },
    {
        "idAlbumSputnik": "265771",
        "artistName": "God Mother",
        "albumName": "Vilseledd",
        "note": "3.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265771.jpg"
    },
    {
        "idAlbumSputnik": "264176",
        "artistName": "Carbon Based Lifeforms",
        "albumName": "Derelicts",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264176.jpg"
    },
    {
        "idAlbumSputnik": "265620",
        "artistName": "Esmerine",
        "albumName": "Mechanics of Dominion",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265620.jpg"
    },
    {
        "idAlbumSputnik": "263461",
        "artistName": "IDK",
        "albumName": "IWASVERYBAD",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263461.jpg"
    },
    {
        "idAlbumSputnik": "264880",
        "artistName": "The Midnight",
        "albumName": "Nocturnal",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264880.jpg"
    },
    {
        "idAlbumSputnik": "266387",
        "artistName": "Jamie Lenman",
        "albumName": "Devolver",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266387.jpg"
    },
    {
        "idAlbumSputnik": "264263",
        "artistName": "Angel Vivaldi",
        "albumName": "Synapse",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264263.jpg"
    },
    {
        "idAlbumSputnik": "264422",
        "artistName": "Exhumed",
        "albumName": "Death Revenge",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264422.jpg"
    },
    {
        "idAlbumSputnik": "264830",
        "artistName": "Through the Eyes of the Dead",
        "albumName": "Disomus",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264830.jpg"
    },
    {
        "idAlbumSputnik": "266596",
        "artistName": "Blood Freak",
        "albumName": "Total Destruction of the Human Form",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266596.jpg"
    },
    {
        "idAlbumSputnik": "262227",
        "artistName": "Deaf Havana",
        "albumName": "All These Countless Nights Reworked",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262227.jpg"
    },
    {
        "idAlbumSputnik": "267034",
        "artistName": "21 Savage, Offset and Metro Boomin",
        "albumName": "Without Warning",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267034.jpg"
    },
    {
        "idAlbumSputnik": "265511",
        "artistName": "Radiator Hospital",
        "albumName": "Play The Songs You Like",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265511.jpg"
    },
    {
        "idAlbumSputnik": "265214",
        "artistName": "Nai Palm",
        "albumName": "Needle Paw",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265214.jpg"
    },
    {
        "idAlbumSputnik": "255589",
        "artistName": "Samael",
        "albumName": "Hegemony",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/255589.jpg"
    },
    {
        "idAlbumSputnik": "259562",
        "artistName": "Makthaverskan",
        "albumName": "III",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259562.jpg"
    },
    {
        "idAlbumSputnik": "259492",
        "artistName": "My Ticket Home",
        "albumName": "Unreal",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259492.jpg"
    },
    {
        "idAlbumSputnik": "258070",
        "artistName": "Knuckle Puck",
        "albumName": "Shapeshifter",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/258070.jpg"
    },
    {
        "idAlbumSputnik": "261249",
        "artistName": "St. Vincent",
        "albumName": "MASSEDUCTION",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261249.jpg"
    },
    {
        "idAlbumSputnik": "264247",
        "artistName": "Johari",
        "albumName": "Terra",
        "note": "3.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264247.jpg"
    },
    {
        "idAlbumSputnik": "264304",
        "artistName": "The Mountain Goats",
        "albumName": "Marsh Witch Visions",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264304.jpg"
    },
    {
        "idAlbumSputnik": "262728",
        "artistName": "Blut Aus Nord",
        "albumName": "Deus Salutis Meae",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262728.jpg"
    },
    {
        "idAlbumSputnik": "266394",
        "artistName": "Fever Ray",
        "albumName": "Plunge",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266394.jpg"
    },
    {
        "idAlbumSputnik": "262978",
        "artistName": "Coma Cluster Void",
        "albumName": "Thoughts From A Stone",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262978.jpg"
    },
    {
        "idAlbumSputnik": "263955",
        "artistName": "Wolf and Bear",
        "albumName": "Everything Is Going Grey",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263955.jpg"
    },
    {
        "idAlbumSputnik": "258726",
        "artistName": "Shpongle",
        "albumName": "Codex VI",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/258726.jpg"
    },
    {
        "idAlbumSputnik": "263659",
        "artistName": "Blue Hawaii",
        "albumName": "Tenderness",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263659.jpg"
    },
    {
        "idAlbumSputnik": "262167",
        "artistName": "Lee Gamble",
        "albumName": "Mnestic Pressure",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262167.jpg"
    },
    {
        "idAlbumSputnik": "264418",
        "artistName": "The Weather Station",
        "albumName": "The Weather Station",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264418.jpg"
    },
    {
        "idAlbumSputnik": "259471",
        "artistName": "Destroyer",
        "albumName": "Ken",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259471.jpg"
    },
    {
        "idAlbumSputnik": "266571",
        "artistName": "Krallice",
        "albumName": "LoÃ¼m",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266571.jpg"
    },
    {
        "idAlbumSputnik": "260680",
        "artistName": "I the Mighty",
        "albumName": "Where the Mind Wants to Go / Where You Let it Go",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260680.jpg"
    },
    {
        "idAlbumSputnik": "263970",
        "artistName": "Daniel Cavanagh",
        "albumName": "Monochrome",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263970.jpg"
    },
    {
        "idAlbumSputnik": "266378",
        "artistName": "Yelawolf",
        "albumName": "Trial by Fire",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266378.jpg"
    },
    {
        "idAlbumSputnik": "264129",
        "artistName": "Yumi Zouma",
        "albumName": "Willowbank",
        "note": "3.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264129.jpg"
    },
    {
        "idAlbumSputnik": "262645",
        "artistName": "Spotlights",
        "albumName": "Seismic",
        "note": "3.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262645.jpg"
    },
    {
        "idAlbumSputnik": "259511",
        "artistName": "10 Years",
        "albumName": "(How to Live) As Ghosts",
        "note": "3.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259511.jpg"
    },
    {
        "idAlbumSputnik": "264988",
        "artistName": "Bodyjar",
        "albumName": "Terra Firma",
        "note": "3.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264988.jpg"
    },
    {
        "idAlbumSputnik": "263597",
        "artistName": "Sons of Apollo",
        "albumName": "Psychotic Symphony",
        "note": "3.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263597.jpg"
    },
    {
        "idAlbumSputnik": "263899",
        "artistName": "Dawn Ray'd",
        "albumName": "The Unlawful Assembly",
        "note": "3.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263899.jpg"
    },
    {
        "idAlbumSputnik": "257749",
        "artistName": "Wolf Parade",
        "albumName": "Cry Cry Cry",
        "note": "3.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/257749.jpg"
    },
    {
        "idAlbumSputnik": "264914",
        "artistName": "Slaughter Beach, Dog",
        "albumName": "Birdie",
        "note": "3.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264914.jpg"
    },
    {
        "idAlbumSputnik": "261266",
        "artistName": "Veil of Maya",
        "albumName": "False Idol",
        "note": "3.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261266.jpg"
    },
    {
        "idAlbumSputnik": "262827",
        "artistName": "Jessie Ware",
        "albumName": "Glasshouse",
        "note": "3.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262827.jpg"
    },
    {
        "idAlbumSputnik": "262888",
        "artistName": "Billy Corgan",
        "albumName": "Ogilala",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262888.jpg"
    },
    {
        "idAlbumSputnik": "266635",
        "artistName": "Hotel Books",
        "albumName": "Equivalency",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266635.jpg"
    },
    {
        "idAlbumSputnik": "264367",
        "artistName": "Gwen Stefani",
        "albumName": "You Make It Feel Like Christmas",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264367.jpg"
    },
    {
        "idAlbumSputnik": "259579",
        "artistName": "Vassafor",
        "albumName": "Malediction",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259579.jpg"
    },
    {
        "idAlbumSputnik": "262316",
        "artistName": "We Came As Romans",
        "albumName": "Cold Like War",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262316.jpg"
    },
    {
        "idAlbumSputnik": "260747",
        "artistName": "Courtney Barnett and Kurt Vile",
        "albumName": "Lotta Sea Lice",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260747.jpg"
    },
    {
        "idAlbumSputnik": "266346",
        "artistName": "Endur",
        "albumName": "American Parasite",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266346.jpg"
    },
    {
        "idAlbumSputnik": "227534",
        "artistName": "Tetragrammacide",
        "albumName": "Primal Incinerators of Moral Matrix",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/227534.jpg"
    },
    {
        "idAlbumSputnik": "266980",
        "artistName": "Willow Smith",
        "albumName": "The 1st",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266980.jpg"
    },
    {
        "idAlbumSputnik": "265703",
        "artistName": "Odonis Odonis",
        "albumName": "No Pop",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265703.jpg"
    },
    {
        "idAlbumSputnik": "263375",
        "artistName": "dvsn",
        "albumName": "Morning After",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263375.jpg"
    },
    {
        "idAlbumSputnik": "263801",
        "artistName": "Kllo",
        "albumName": "Backwater",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263801.jpg"
    },
    {
        "idAlbumSputnik": "265269",
        "artistName": "ROAM",
        "albumName": "Great Heights & Nosedives",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265269.jpg"
    },
    {
        "idAlbumSputnik": "262825",
        "artistName": "Brent Faiyaz",
        "albumName": "Sonder Son",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262825.jpg"
    },
    {
        "idAlbumSputnik": "261614",
        "artistName": "John Maus",
        "albumName": "Screen Memories",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261614.jpg"
    },
    {
        "idAlbumSputnik": "264235",
        "artistName": "Fear, and Loathing in Las Vegas",
        "albumName": "New Sunrise",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264235.jpg"
    },
    {
        "idAlbumSputnik": "262954",
        "artistName": "Winds of Plague",
        "albumName": "Blood of My Enemy",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262954.jpg"
    },
    {
        "idAlbumSputnik": "264419",
        "artistName": "Wu-Tang Clan",
        "albumName": "The Saga Continues",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264419.jpg"
    },
    {
        "idAlbumSputnik": "264265",
        "artistName": "NF",
        "albumName": "Perception",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264265.jpg"
    },
    {
        "idAlbumSputnik": "264398",
        "artistName": "Shigeto",
        "albumName": "The New Monday",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264398.jpg"
    },
    {
        "idAlbumSputnik": "265242",
        "artistName": "Sabrina Claudio",
        "albumName": "About Time",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265242.jpg"
    },
    {
        "idAlbumSputnik": "264884",
        "artistName": "No Warning",
        "albumName": "Torture Culture",
        "note": "3.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264884.jpg"
    },
    {
        "idAlbumSputnik": "235786",
        "artistName": "Marilyn Manson",
        "albumName": "Heaven Upside Down",
        "note": "3.2",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/235786.jpg"
    },
    {
        "idAlbumSputnik": "264431",
        "artistName": "Stars",
        "albumName": "There Is No Love In Fluorescent Light",
        "note": "3.2",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264431.jpg"
    },
    {
        "idAlbumSputnik": "261726",
        "artistName": "The Ongoing Concept",
        "albumName": "Places",
        "note": "3.2",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261726.jpg"
    },
    {
        "idAlbumSputnik": "266585",
        "artistName": "Majid Jordan",
        "albumName": "The Space Between",
        "note": "3.2",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266585.jpg"
    },
    {
        "idAlbumSputnik": "261296",
        "artistName": "The Used",
        "albumName": "The Canyon",
        "note": "3.2",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261296.jpg"
    },
    {
        "idAlbumSputnik": "266639",
        "artistName": "Colleen",
        "albumName": "A flame my love, a frequency",
        "note": "3.2",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266639.jpg"
    },
    {
        "idAlbumSputnik": "266923",
        "artistName": "Skepta",
        "albumName": "Vicious",
        "note": "3.2",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266923.jpg"
    },
    {
        "idAlbumSputnik": "263303",
        "artistName": "Antwon",
        "albumName": "Sunnyvale Gardens",
        "note": "3.2",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263303.jpg"
    },
    {
        "idAlbumSputnik": "264315",
        "artistName": "Slow Magic",
        "albumName": "Float",
        "note": "3.2",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264315.jpg"
    },
    {
        "idAlbumSputnik": "245826",
        "artistName": "Vuur",
        "albumName": "In This Moment We Are Free - Cities",
        "note": "3.2",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/245826.jpg"
    },
    {
        "idAlbumSputnik": "265753",
        "artistName": "Future and Young Thug",
        "albumName": "Super Slimey",
        "note": "3.1",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265753.jpg"
    },
    {
        "idAlbumSputnik": "264834",
        "artistName": "Oliver Francis",
        "albumName": "A Million Miles An Hour",
        "note": "3.1",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264834.jpg"
    },
    {
        "idAlbumSputnik": "264360",
        "artistName": "The Rasmus",
        "albumName": "Dark Matter",
        "note": "3.1",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264360.jpg"
    },
    {
        "idAlbumSputnik": "265093",
        "artistName": "Cairo Knife Fight",
        "albumName": "Seven",
        "note": "3.1",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265093.jpg"
    },
    {
        "idAlbumSputnik": "264523",
        "artistName": "Coldrain",
        "albumName": "FATELESS",
        "note": "3.1",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264523.jpg"
    },
    {
        "idAlbumSputnik": "265817",
        "artistName": "Lindstrom",
        "albumName": "It's Alright Between Us As It Is",
        "note": "3.1",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265817.jpg"
    },
    {
        "idAlbumSputnik": "264835",
        "artistName": "Sorority Noise",
        "albumName": "Alone",
        "note": "3.1",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264835.jpg"
    },
    {
        "idAlbumSputnik": "258281",
        "artistName": "Europe",
        "albumName": "Walk the Earth",
        "note": "3.1",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/258281.jpg"
    },
    {
        "idAlbumSputnik": "265809",
        "artistName": "nothing,nowhere.",
        "albumName": "Reaper",
        "note": "3.1",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265809.jpg"
    },
    {
        "idAlbumSputnik": "260142",
        "artistName": "Beck",
        "albumName": "Colors",
        "note": "3.0",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260142.jpg"
    },
    {
        "idAlbumSputnik": "262407",
        "artistName": "Red",
        "albumName": "Gone",
        "note": "3.0",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262407.jpg"
    },
    {
        "idAlbumSputnik": "265804",
        "artistName": "Slipknot",
        "albumName": "Day of the Gusano",
        "note": "3.0",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265804.jpg"
    },
    {
        "idAlbumSputnik": "266461",
        "artistName": "Lil Wop",
        "albumName": "Wopavelli 3",
        "note": "3.0",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266461.jpg"
    },
    {
        "idAlbumSputnik": "260105",
        "artistName": "The Front Bottoms",
        "albumName": "Going Grey",
        "note": "3.0",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260105.jpg"
    },
    {
        "idAlbumSputnik": "259139",
        "artistName": "Pink",
        "albumName": "Beautiful Trauma",
        "note": "3.0",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259139.jpg"
    },
    {
        "idAlbumSputnik": "264120",
        "artistName": "Big Dumb Face",
        "albumName": "Where Is Duke Lion? He's Dead...",
        "note": "2.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264120.jpg"
    },
    {
        "idAlbumSputnik": "265484",
        "artistName": "Lil Durk",
        "albumName": "Signed To The Streets 2.5",
        "note": "2.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265484.jpg"
    },
    {
        "idAlbumSputnik": "262695",
        "artistName": "Ty Dolla Sign",
        "albumName": "Beach House 3",
        "note": "2.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262695.jpg"
    },
    {
        "idAlbumSputnik": "254369",
        "artistName": "Liam Gallagher",
        "albumName": "As You Were",
        "note": "2.9",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/254369.jpg"
    },
    {
        "idAlbumSputnik": "261518",
        "artistName": "Margo Price",
        "albumName": "All American Made",
        "note": "2.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261518.jpg"
    },
    {
        "idAlbumSputnik": "259565",
        "artistName": "Gucci Mane",
        "albumName": "Mr. Davis",
        "note": "2.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259565.jpg"
    },
    {
        "idAlbumSputnik": "264179",
        "artistName": "Sutekh Hexen / Hissing",
        "albumName": "Sutekh Hexen / Hissing",
        "note": "2.8",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264179.jpg"
    },
    {
        "idAlbumSputnik": "264424",
        "artistName": "Gothminister",
        "albumName": "The Other Side",
        "note": "2.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264424.jpg"
    },
    {
        "idAlbumSputnik": "263953",
        "artistName": "Kelly Clarkson",
        "albumName": "Meaning of Life",
        "note": "2.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263953.jpg"
    },
    {
        "idAlbumSputnik": "265837",
        "artistName": "Niall Horan",
        "albumName": "Flicker",
        "note": "2.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265837.jpg"
    },
    {
        "idAlbumSputnik": "265721",
        "artistName": "Bully",
        "albumName": "Losing",
        "note": "2.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265721.jpg"
    },
    {
        "idAlbumSputnik": "264425",
        "artistName": "MyChildren MyBride",
        "albumName": "Vicious World",
        "note": "2.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264425.jpg"
    },
    {
        "idAlbumSputnik": "260100",
        "artistName": "GWAR",
        "albumName": "The Blood of Gods",
        "note": "2.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260100.jpg"
    },
    {
        "idAlbumSputnik": "260512",
        "artistName": "Cyhra",
        "albumName": "Letters To Myself",
        "note": "2.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260512.jpg"
    },
    {
        "idAlbumSputnik": "263447",
        "artistName": "That Poppy",
        "albumName": "Poppy.Computer",
        "note": "2.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263447.jpg"
    },
    {
        "idAlbumSputnik": "267105",
        "artistName": "Trippie Redd and Lil Wop",
        "albumName": "Angels & Demons",
        "note": "2.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267105.jpg"
    },
    {
        "idAlbumSputnik": "266409",
        "artistName": "Powerman 5000",
        "albumName": "New Wave",
        "note": "2.6",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266409.jpg"
    },
    {
        "idAlbumSputnik": "263316",
        "artistName": "Lil Pump",
        "albumName": "Lil Pump",
        "note": "2.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263316.jpg"
    },
    {
        "idAlbumSputnik": "265772",
        "artistName": "Matthew Good",
        "albumName": "Something Like a Storm",
        "note": "2.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265772.jpg"
    },
    {
        "idAlbumSputnik": "259548",
        "artistName": "Weezer",
        "albumName": "Pacific Daydream",
        "note": "2.5",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259548.jpg"
    },
    {
        "idAlbumSputnik": "262002",
        "artistName": "Trippie Redd",
        "albumName": "A Love Letter to You 2",
        "note": "2.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262002.jpg"
    },
    {
        "idAlbumSputnik": "259475",
        "artistName": "Hollywood Undead",
        "albumName": "Five",
        "note": "2.3",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259475.jpg"
    },
    {
        "idAlbumSputnik": "260553",
        "artistName": "Butcher Babies",
        "albumName": "Lilith",
        "note": "2.2",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260553.jpg"
    },
    {
        "idAlbumSputnik": "259124",
        "artistName": "Fozzy",
        "albumName": "Judas",
        "note": "2.1",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259124.jpg"
    },
    {
        "idAlbumSputnik": "265716",
        "artistName": "Adelitas Way",
        "albumName": "Notorious",
        "note": "2.1",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265716.jpg"
    },
    {
        "idAlbumSputnik": "266778",
        "artistName": "Chris Brown",
        "albumName": "Heartbreak on a Full Moon",
        "note": "1.7",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266778.jpg"
    },
    {
        "idAlbumSputnik": "258135",
        "artistName": "Theory Of A Deadman",
        "albumName": "Wake Up Call",
        "note": "1.4",
        "releaseMonth": "October 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/258135.jpg"
    }
];

function seedDB(){
    //remove all albums
    Album.remove({}, (err) => {
      if (err){
          console.log(err);
      } 
      //console.log("removed Album");
      //add a few albums
        data.forEach((seed) => {
            Album.create(seed, (err, album) => {
                if(err){
                    console.log(err);
                } else{
                    //console.log("added an album");
                    album.save();
                }
            });
        });
    });
    
    
}


module.exports = seedDB;