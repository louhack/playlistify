var mongoose = require("mongoose");
var Album = require("../models/album.model");

var data = [
    {
        "idAlbumSputnik": "266349",
        "artistName": "Typhoon (USA-OR)",
        "albumName": "Offerings",
        "note": "4.3",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266349.jpg"
    },
    {
        "idAlbumSputnik": "270174",
        "artistName": "Hamferd",
        "albumName": "TÃ¡msins likam",
        "note": "4.1",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270174.jpg"
    },
    {
        "idAlbumSputnik": "271334",
        "artistName": "Count to Altek",
        "albumName": "Path Kethona",
        "note": "4.0",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/271334.jpg"
    },
    {
        "idAlbumSputnik": "272479",
        "artistName": "Jeff Rosenstock",
        "albumName": "POST-",
        "note": "3.9",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272479.jpg"
    },
    {
        "idAlbumSputnik": "267848",
        "artistName": "Corrosion of Conformity",
        "albumName": "No Cross No Crown",
        "note": "3.8",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267848.jpg"
    },
    {
        "idAlbumSputnik": "263456",
        "artistName": "Sinistro",
        "albumName": "Sangue Cassia",
        "note": "3.7",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263456.jpg"
    },
    {
        "idAlbumSputnik": "271403",
        "artistName": "Weedpecker",
        "albumName": "III",
        "note": "3.7",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/271403.jpg"
    },
    {
        "idAlbumSputnik": "272681",
        "artistName": "Maxo Kream",
        "albumName": "Punken",
        "note": "3.7",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272681.jpg"
    },
    {
        "idAlbumSputnik": "273379",
        "artistName": "Shame (UK)",
        "albumName": "Songs Of Praise",
        "note": "3.6",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/273379.jpg"
    },
    {
        "idAlbumSputnik": "272585",
        "artistName": "Volahn/Xaxamatza",
        "albumName": "Gods of Pandemonium",
        "note": "3.6",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272585.jpg"
    },
    {
        "idAlbumSputnik": "265988",
        "artistName": "Harakiri for the Sky",
        "albumName": "Arson",
        "note": "3.5",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265988.jpg"
    },
    {
        "idAlbumSputnik": "262310",
        "artistName": "Black Rebel Motorcycle Club",
        "albumName": "Wrong Creatures",
        "note": "3.4",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262310.jpg"
    },
    {
        "idAlbumSputnik": "272400",
        "artistName": "cavetown",
        "albumName": "Lemon Boy",
        "note": "3.3",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272400.jpg"
    },
    {
        "idAlbumSputnik": "265990",
        "artistName": "Summoning",
        "albumName": "With Doom We Come",
        "note": "3.3",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265990.jpg"
    },
    {
        "idAlbumSputnik": "272466",
        "artistName": "Scallops Hotel",
        "albumName": "sovereign nose of (yâ)âour arrogant face",
        "note": "3.3",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272466.jpg"
    },
    {
        "idAlbumSputnik": "263052",
        "artistName": "Joe Satriani",
        "albumName": "What Happens Next",
        "note": "3.2",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263052.jpg"
    },
    {
        "idAlbumSputnik": "271900",
        "artistName": "When We Land",
        "albumName": "Introvert's Plight",
        "note": "3.2",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/271900.jpg"
    },
    {
        "idAlbumSputnik": "267119",
        "artistName": "Watain",
        "albumName": "Trident Wolf Eclipse",
        "note": "3.2",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267119.jpg"
    },
    {
        "idAlbumSputnik": "268093",
        "artistName": "Shining (SWE)",
        "albumName": "X - Varg Utan Flock",
        "note": "3.2",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268093.jpg"
    },
    {
        "idAlbumSputnik": "271985",
        "artistName": "Tonight Alive",
        "albumName": "Underworld",
        "note": "3.1",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/271985.jpg"
    },
    {
        "idAlbumSputnik": "273390",
        "artistName": "Camila Cabello",
        "albumName": "Camila",
        "note": "3.0",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/273390.jpg"
    },
    {
        "idAlbumSputnik": "272761",
        "artistName": "cupcakKe",
        "albumName": "Ephorize",
        "note": "3.0",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272761.jpg"
    },
    {
        "idAlbumSputnik": "266221",
        "artistName": "Avatar",
        "albumName": "Avatar Country",
        "note": "2.8",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266221.jpg"
    },
    {
        "idAlbumSputnik": "273412",
        "artistName": "Hasan",
        "albumName": "Province of the Unknown",
        "note": "2.8",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/273412.jpg"
    },
    {
        "idAlbumSputnik": "267799",
        "artistName": "Black Malachite",
        "albumName": "Haunted",
        "note": "2.6",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267799.jpg"
    },
    {
        "idAlbumSputnik": "272496",
        "artistName": "Leaves' Eyes",
        "albumName": "Sign of the Dragonhead",
        "note": "2.6",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272496.jpg"
    },
    {
        "idAlbumSputnik": "272342",
        "artistName": "Brojob",
        "albumName": "Talk Shit Get Kissed",
        "note": "2.4",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272342.jpg"
    },
    {
        "idAlbumSputnik": "263645",
        "artistName": "Black Veil Brides",
        "albumName": "Vale",
        "note": "2.1",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263645.jpg"
    },
    {
        "idAlbumSputnik": "272842",
        "artistName": "Afgrund",
        "albumName": "The Dystopian",
        "note": "2.1",
        "releaseMonth": "January 2018",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272842.jpg"
    },
    {
        "idAlbumSputnik": "251036",
        "artistName": "John Williams",
        "albumName": "Star Wars: The Last Jedi",
        "note": "4.1",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/251036.jpg"
    },
    {
        "idAlbumSputnik": "270589",
        "artistName": "Ojne",
        "albumName": "Prima Che Tutto Bruci",
        "note": "4.0",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270589.jpg"
    },
    {
        "idAlbumSputnik": "270367",
        "artistName": "The Oh Hellos",
        "albumName": "Notos",
        "note": "4.0",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270367.jpg"
    },
    {
        "idAlbumSputnik": "270200",
        "artistName": "Evilfeast",
        "albumName": "Elegies of the Stellar Wind",
        "note": "4.0",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270200.jpg"
    },
    {
        "idAlbumSputnik": "268327",
        "artistName": "Glassjaw",
        "albumName": "Material Control",
        "note": "3.9",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268327.jpg"
    },
    {
        "idAlbumSputnik": "271496",
        "artistName": "Avenged Sevenfold",
        "albumName": "The Stage (Deluxe Edition)",
        "note": "3.9",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/271496.jpg"
    },
    {
        "idAlbumSputnik": "270158",
        "artistName": "The Atomic Bitchwax",
        "albumName": "Force Field",
        "note": "3.9",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270158.jpg"
    },
    {
        "idAlbumSputnik": "268871",
        "artistName": "Tom Rogerson with Brian Eno",
        "albumName": "Finding Shore",
        "note": "3.9",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268871.jpg"
    },
    {
        "idAlbumSputnik": "262034",
        "artistName": "The Dear Hunter",
        "albumName": "All Is As All Should Be",
        "note": "3.9",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262034.jpg"
    },
    {
        "idAlbumSputnik": "265657",
        "artistName": "Brockhampton",
        "albumName": "SATURATION III",
        "note": "3.9",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265657.jpg"
    },
    {
        "idAlbumSputnik": "260967",
        "artistName": "Red Vox",
        "albumName": "Another Light",
        "note": "3.8",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260967.jpg"
    },
    {
        "idAlbumSputnik": "253723",
        "artistName": "Lambsbreath",
        "albumName": "MANFEELINGS",
        "note": "3.8",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/253723.jpg"
    },
    {
        "idAlbumSputnik": "263635",
        "artistName": "Icarus the Owl",
        "albumName": "Rearm Circuits",
        "note": "3.8",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263635.jpg"
    },
    {
        "idAlbumSputnik": "269978",
        "artistName": "Total Control",
        "albumName": "Laughing At The System",
        "note": "3.8",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269978.jpg"
    },
    {
        "idAlbumSputnik": "266435",
        "artistName": "Autopsy",
        "albumName": "Puncturing the Grotesque",
        "note": "3.7",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266435.jpg"
    },
    {
        "idAlbumSputnik": "270365",
        "artistName": "For All Eternity",
        "albumName": "The Will to Rebuild",
        "note": "3.7",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270365.jpg"
    },
    {
        "idAlbumSputnik": "270983",
        "artistName": "Jakub Zytecki",
        "albumName": "Ladder Head",
        "note": "3.7",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270983.jpg"
    },
    {
        "idAlbumSputnik": "270617",
        "artistName": "Wordclock",
        "albumName": "Heralds",
        "note": "3.7",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270617.jpg"
    },
    {
        "idAlbumSputnik": "264511",
        "artistName": "Jess And The Ancient Ones",
        "albumName": "The Horse and Other Weird Tales",
        "note": "3.7",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264511.jpg"
    },
    {
        "idAlbumSputnik": "272228",
        "artistName": "King Gizzard and The Lizard Wizard",
        "albumName": "Gumboot Soup",
        "note": "3.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272228.jpg"
    },
    {
        "idAlbumSputnik": "269026",
        "artistName": "Cleric",
        "albumName": "Retrocausal",
        "note": "3.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269026.jpg"
    },
    {
        "idAlbumSputnik": "270548",
        "artistName": "Vexovoid",
        "albumName": "Call of the Starforger",
        "note": "3.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270548.jpg"
    },
    {
        "idAlbumSputnik": "265845",
        "artistName": "Chris Stapleton",
        "albumName": "From A Room: Volume 2",
        "note": "3.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265845.jpg"
    },
    {
        "idAlbumSputnik": "266537",
        "artistName": "Story of the Year",
        "albumName": "Wolves",
        "note": "3.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266537.jpg"
    },
    {
        "idAlbumSputnik": "270285",
        "artistName": "The Clearing Path",
        "albumName": "Watershed Between Firmament And The Realm of Hyper",
        "note": "3.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270285.jpg"
    },
    {
        "idAlbumSputnik": "270269",
        "artistName": "Ghost (SWE)",
        "albumName": "Ceremony and Devotion",
        "note": "3.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270269.jpg"
    },
    {
        "idAlbumSputnik": "272300",
        "artistName": "Organ Tapes",
        "albumName": "Into One Name",
        "note": "3.5",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272300.jpg"
    },
    {
        "idAlbumSputnik": "252610",
        "artistName": "Diablo Swing Orchestra",
        "albumName": "Pacifisticuffs",
        "note": "3.5",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/252610.jpg"
    },
    {
        "idAlbumSputnik": "271207",
        "artistName": "Special Explosion",
        "albumName": "To Infinity",
        "note": "3.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/271207.jpg"
    },
    {
        "idAlbumSputnik": "271440",
        "artistName": "Nortt",
        "albumName": "Endeligt",
        "note": "3.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/271440.jpg"
    },
    {
        "idAlbumSputnik": "270164",
        "artistName": "DSKNT",
        "albumName": "PhSPHR Entropy",
        "note": "3.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270164.jpg"
    },
    {
        "idAlbumSputnik": "264829",
        "artistName": "War of Ages",
        "albumName": "Alpha",
        "note": "3.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264829.jpg"
    },
    {
        "idAlbumSputnik": "268559",
        "artistName": "Linkin Park",
        "albumName": "One More Light Live",
        "note": "3.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268559.jpg"
    },
    {
        "idAlbumSputnik": "266830",
        "artistName": "Feared",
        "albumName": "Svart",
        "note": "3.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266830.jpg"
    },
    {
        "idAlbumSputnik": "269158",
        "artistName": "N.E.R.D.",
        "albumName": "NO ONE EVER REALLY DIES",
        "note": "3.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269158.jpg"
    },
    {
        "idAlbumSputnik": "270101",
        "artistName": "Lil Wayne",
        "albumName": "Dedication 6",
        "note": "3.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270101.jpg"
    },
    {
        "idAlbumSputnik": "271105",
        "artistName": "Hannah Diamond",
        "albumName": "Soon I Won't See You at All",
        "note": "3.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/271105.jpg"
    },
    {
        "idAlbumSputnik": "270237",
        "artistName": "Charli XCX",
        "albumName": "Pop2",
        "note": "3.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270237.jpg"
    },
    {
        "idAlbumSputnik": "270273",
        "artistName": "Belle and Sebastian",
        "albumName": "How To Solve Our Human Problems Pt. 1",
        "note": "3.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270273.jpg"
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
        "idAlbumSputnik": "268757",
        "artistName": "Eldamar",
        "albumName": "A Dark Forgotten Past",
        "note": "3.3",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268757.jpg"
    },
    {
        "idAlbumSputnik": "268554",
        "artistName": "Roy Woods",
        "albumName": "Say Less",
        "note": "3.3",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268554.jpg"
    },
    {
        "idAlbumSputnik": "270257",
        "artistName": "Thaw",
        "albumName": "Grains",
        "note": "3.3",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270257.jpg"
    },
    {
        "idAlbumSputnik": "270004",
        "artistName": "Project 86",
        "albumName": "Sheep Among Wolves",
        "note": "3.3",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270004.jpg"
    },
    {
        "idAlbumSputnik": "268548",
        "artistName": "Loth",
        "albumName": "Apocryphe",
        "note": "3.3",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268548.jpg"
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
        "idAlbumSputnik": "268092",
        "artistName": "Intervals",
        "albumName": "The Way Forward",
        "note": "3.3",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268092.jpg"
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
        "note": "3.2",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267110.jpg"
    },
    {
        "idAlbumSputnik": "265226",
        "artistName": "A Night in Texas",
        "albumName": "Global Slaughter",
        "note": "3.2",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265226.jpg"
    },
    {
        "idAlbumSputnik": "272005",
        "artistName": "Bladee",
        "albumName": "Working On Dying",
        "note": "3.2",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272005.jpg"
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
        "idAlbumSputnik": "267842",
        "artistName": "Black Malachite",
        "albumName": "Motion",
        "note": "3.1",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267842.jpg"
    },
    {
        "idAlbumSputnik": "269633",
        "artistName": "Jeezy",
        "albumName": "Pressure",
        "note": "2.9",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269633.jpg"
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
        "idAlbumSputnik": "271537",
        "artistName": "Travis Scott and Quavo",
        "albumName": "Huncho Jack, Jack Huncho",
        "note": "2.8",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/271537.jpg"
    },
    {
        "idAlbumSputnik": "270231",
        "artistName": "Avenged Sevenfold",
        "albumName": "Live At The Grammy Museum",
        "note": "2.8",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270231.jpg"
    },
    {
        "idAlbumSputnik": "270900",
        "artistName": "Gucci Mane",
        "albumName": "El Gato: The Human Glacier",
        "note": "2.7",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270900.jpg"
    },
    {
        "idAlbumSputnik": "266245",
        "artistName": "Asking Alexandria",
        "albumName": "Asking Alexandria",
        "note": "2.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266245.jpg"
    },
    {
        "idAlbumSputnik": "272165",
        "artistName": "Francis and the Lights",
        "albumName": "Just For Us",
        "note": "2.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/272165.jpg"
    },
    {
        "idAlbumSputnik": "268075",
        "artistName": "Chief Keef",
        "albumName": "Dedication",
        "note": "2.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268075.jpg"
    },
    {
        "idAlbumSputnik": "267029",
        "artistName": "U2",
        "albumName": "Songs of Experience",
        "note": "2.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267029.jpg"
    },
    {
        "idAlbumSputnik": "267764",
        "artistName": "G-Eazy",
        "albumName": "The Beautiful & Damned",
        "note": "2.5",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267764.jpg"
    },
    {
        "idAlbumSputnik": "270247",
        "artistName": "Quality Control Music",
        "albumName": "Control The Streets Volume 1",
        "note": "2.5",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270247.jpg"
    },
    {
        "idAlbumSputnik": "270539",
        "artistName": "Pole Younger",
        "albumName": "ÐÐ°ÑÑÐµÐ½Ð½Ð°Ñ Ð±ÐµÑÐ¿Ð¾Ð¼Ð¾ÑÐ½Ð¾ÑÑÑ",
        "note": "2.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270539.jpg"
    },
    {
        "idAlbumSputnik": "269696",
        "artistName": "Deuce",
        "albumName": "Invincible",
        "note": "2.4",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269696.jpg"
    },
    {
        "idAlbumSputnik": "270012",
        "artistName": "Big Sean and Metro Boomin",
        "albumName": "Double Or Nothing",
        "note": "2.3",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270012.jpg"
    },
    {
        "idAlbumSputnik": "264544",
        "artistName": "Operation: Mindcrime",
        "albumName": "The New Reality",
        "note": "1.9",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264544.jpg"
    },
    {
        "idAlbumSputnik": "270525",
        "artistName": "XXXTENTACION",
        "albumName": "A GHETTO CHRISTMAS CAROL!",
        "note": "1.8",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270525.jpg"
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
        "idAlbumSputnik": "270324",
        "artistName": "Eminem",
        "albumName": "Revival",
        "note": "1.6",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270324.jpg"
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
        "idAlbumSputnik": "270401",
        "artistName": "Kendrick Lamar",
        "albumName": "DAMN. Collector's Edition",
        "note": "1.2",
        "releaseMonth": "December 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270401.jpg"
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
        "idAlbumSputnik": "269233",
        "artistName": "Boris",
        "albumName": "Live At Third Man Records",
        "note": "4.1",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269233.jpg"
    },
    {
        "idAlbumSputnik": "265075",
        "artistName": "Fleet Foxes",
        "albumName": "The Electric Lady Session",
        "note": "4.1",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265075.jpg"
    },
    {
        "idAlbumSputnik": "268445",
        "artistName": "Black Sabbath",
        "albumName": "The End (Live)",
        "note": "4.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268445.jpg"
    },
    {
        "idAlbumSputnik": "269707",
        "artistName": "Fjort",
        "albumName": "Couleur",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269707.jpg"
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
        "idAlbumSputnik": "268540",
        "artistName": "Degial",
        "albumName": "Predator Reign",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268540.jpg"
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
        "idAlbumSputnik": "269266",
        "artistName": "Bodysnatcher",
        "albumName": "Death Of Me",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269266.jpg"
    },
    {
        "idAlbumSputnik": "264506",
        "artistName": "Adimiron",
        "albumName": "Et Liber Eris",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264506.jpg"
    },
    {
        "idAlbumSputnik": "267912",
        "artistName": "LOFT",
        "albumName": "Three Settlements Four Ways",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267912.jpg"
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
        "idAlbumSputnik": "267462",
        "artistName": "James Holden and The Animal Spirits",
        "albumName": "The Animal Spirits",
        "note": "3.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267462.jpg"
    },
    {
        "idAlbumSputnik": "267426",
        "artistName": "Thantifaxath",
        "albumName": "Void Masquerading as Matter",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267426.jpg"
    },
    {
        "idAlbumSputnik": "265728",
        "artistName": "Desolate Shrine",
        "albumName": "Deliverance From The Godless Void",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265728.jpg"
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
        "idAlbumSputnik": "262637",
        "artistName": "Iron Maiden",
        "albumName": "The Book of Souls: Live Chapter",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262637.jpg"
    },
    {
        "idAlbumSputnik": "269477",
        "artistName": "Silent Whale Becomes a Dream",
        "albumName": "Requiem",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269477.jpg"
    },
    {
        "idAlbumSputnik": "268271",
        "artistName": "King Gizzard and The Lizard Wizard",
        "albumName": "Polygondwanaland",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268271.jpg"
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
        "idAlbumSputnik": "264059",
        "artistName": "Beast In Black",
        "albumName": "Berserker",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264059.jpg"
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
        "idAlbumSputnik": "268192",
        "artistName": "The Dark Element",
        "albumName": "The Dark Element",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268192.jpg"
    },
    {
        "idAlbumSputnik": "269868",
        "artistName": "Swarms",
        "albumName": "Black Chapel Sun",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269868.jpg"
    },
    {
        "idAlbumSputnik": "268029",
        "artistName": "Deadspace",
        "albumName": "The Liquid Sky",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268029.jpg"
    },
    {
        "idAlbumSputnik": "271130",
        "artistName": "Boucle Infinie",
        "albumName": "ç´ç·ç§»å",
        "note": "3.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/271130.jpg"
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
        "idAlbumSputnik": "259177",
        "artistName": "The Unguided",
        "albumName": "And The Battle Royale",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259177.jpg"
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
        "idAlbumSputnik": "266090",
        "artistName": "Charlotte Gainsbourg",
        "albumName": "Rest",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266090.jpg"
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
        "idAlbumSputnik": "268585",
        "artistName": "Gleemer",
        "albumName": "Anymore",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268585.jpg"
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
        "idAlbumSputnik": "269064",
        "artistName": "Aetherian",
        "albumName": "The Untamed Wilderness",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269064.jpg"
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
        "idAlbumSputnik": "267217",
        "artistName": "Name",
        "albumName": ".â.â.âYou Are Mostly Nowhere",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267217.jpg"
    },
    {
        "idAlbumSputnik": "260494",
        "artistName": "Moonspell",
        "albumName": "1755",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260494.jpg"
    },
    {
        "idAlbumSputnik": "267908",
        "artistName": "Merkabah (PL)",
        "albumName": "Million Miles",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267908.jpg"
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
        "idAlbumSputnik": "269082",
        "artistName": "Sect",
        "albumName": "No Cure For Death",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269082.jpg"
    },
    {
        "idAlbumSputnik": "268746",
        "artistName": "Antigama",
        "albumName": "Depressant",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268746.jpg"
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
        "idAlbumSputnik": "267480",
        "artistName": "Chepang",
        "albumName": "A Tale Of Wildfire",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267480.jpg"
    },
    {
        "idAlbumSputnik": "261338",
        "artistName": "Entheos (USA)",
        "albumName": "Dark Future",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261338.jpg"
    },
    {
        "idAlbumSputnik": "269020",
        "artistName": "Hollow Prophet",
        "albumName": "Hellhole",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269020.jpg"
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
        "idAlbumSputnik": "268853",
        "artistName": "Krallice",
        "albumName": "Go Be Forgotten",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268853.jpg"
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
        "idAlbumSputnik": "261299",
        "artistName": "Cannibal Corpse",
        "albumName": "Red Before Black",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261299.jpg"
    },
    {
        "idAlbumSputnik": "267118",
        "artistName": "Sharon Jones and the Dap-Kings",
        "albumName": "Soul Of A Woman",
        "note": "3.7",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267118.jpg"
    },
    {
        "idAlbumSputnik": "267947",
        "artistName": "Your Memorial",
        "albumName": "Your Memorial",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267947.jpg"
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
        "idAlbumSputnik": "268679",
        "artistName": "Death Toll 80k",
        "albumName": "Step Down",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268679.jpg"
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
        "idAlbumSputnik": "262109",
        "artistName": "Cloak",
        "albumName": "To Venomous Depth",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262109.jpg"
    },
    {
        "idAlbumSputnik": "268584",
        "artistName": "Chaos Moon",
        "albumName": "Eschaton MÃ©moire",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268584.jpg"
    },
    {
        "idAlbumSputnik": "268522",
        "artistName": "Tame Impala",
        "albumName": "Currents B-Sides & Remixes",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268522.jpg"
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
        "idAlbumSputnik": "267024",
        "artistName": "Bibio",
        "albumName": "Phantom Brickworks",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267024.jpg"
    },
    {
        "idAlbumSputnik": "269163",
        "artistName": "Red Velvet",
        "albumName": "Perfect Velvet",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269163.jpg"
    },
    {
        "idAlbumSputnik": "269927",
        "artistName": "Claro Intelecto",
        "albumName": "Exhilarator",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269927.jpg"
    },
    {
        "idAlbumSputnik": "267338",
        "artistName": "Aosoth",
        "albumName": "V: The Inside Scriptures",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267338.jpg"
    },
    {
        "idAlbumSputnik": "261983",
        "artistName": "Husker Du",
        "albumName": "Savage Young DÃ¼",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261983.jpg"
    },
    {
        "idAlbumSputnik": "264508",
        "artistName": "Autobahn",
        "albumName": "The Moral Crossing",
        "note": "3.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264508.jpg"
    },
    {
        "idAlbumSputnik": "267996",
        "artistName": "Call Super",
        "albumName": "Arpo",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267996.jpg"
    },
    {
        "idAlbumSputnik": "268091",
        "artistName": "Phinehas",
        "albumName": "Dark Flag",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268091.jpg"
    },
    {
        "idAlbumSputnik": "267219",
        "artistName": "Scour",
        "albumName": "Red",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267219.jpg"
    },
    {
        "idAlbumSputnik": "267004",
        "artistName": "Yaeji",
        "albumName": "EP2",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267004.jpg"
    },
    {
        "idAlbumSputnik": "263071",
        "artistName": "Threat Signal",
        "albumName": "Disconnect",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263071.jpg"
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
        "idAlbumSputnik": "268547",
        "artistName": "Almyrkvi",
        "albumName": "Umbra",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268547.jpg"
    },
    {
        "idAlbumSputnik": "268069",
        "artistName": "Langhorne Slim",
        "albumName": "Lost At Last, Vol 1",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268069.jpg"
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
        "idAlbumSputnik": "269204",
        "artistName": "Sufjan Stevens",
        "albumName": "The Greatest Gift",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269204.jpg"
    },
    {
        "idAlbumSputnik": "267096",
        "artistName": "Talib Kweli",
        "albumName": "Radio Silence",
        "note": "3.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267096.jpg"
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
        "idAlbumSputnik": "269068",
        "artistName": "GFOTY",
        "albumName": "GFOTYBUCKS",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269068.jpg"
    },
    {
        "idAlbumSputnik": "266555",
        "artistName": "Polkadot Cadaver",
        "albumName": "Get Possessed",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266555.jpg"
    },
    {
        "idAlbumSputnik": "268643",
        "artistName": "Cryptodira",
        "albumName": "The Devil's Despair",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268643.jpg"
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
        "idAlbumSputnik": "267153",
        "artistName": "Cruciamentum",
        "albumName": "Paradise Envenomed",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267153.jpg"
    },
    {
        "idAlbumSputnik": "268824",
        "artistName": "Teen Daze",
        "albumName": "Themes for a New Earth",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268824.jpg"
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
        "idAlbumSputnik": "268557",
        "artistName": "Emancipator",
        "albumName": "Baralku",
        "note": "3.4",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268557.jpg"
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
        "idAlbumSputnik": "262767",
        "artistName": "Baths",
        "albumName": "Romaplasm",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262767.jpg"
    },
    {
        "idAlbumSputnik": "261438",
        "artistName": "Like Moths to Flames",
        "albumName": "Dark Divine",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261438.jpg"
    },
    {
        "idAlbumSputnik": "262693",
        "artistName": "Backtrack",
        "albumName": "Bad To My World",
        "note": "3.3",
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
        "idAlbumSputnik": "265665",
        "artistName": "Speak the Truth... Even if Your Voice Shakes",
        "albumName": "Everyone You Love Will Slip Away From You",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265665.jpg"
    },
    {
        "idAlbumSputnik": "259517",
        "artistName": "Kawir",
        "albumName": "Exilasmos",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259517.jpg"
    },
    {
        "idAlbumSputnik": "267766",
        "artistName": "Cam'ron",
        "albumName": "The Program",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267766.jpg"
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
        "idAlbumSputnik": "267729",
        "artistName": "Statues",
        "albumName": "No Grave, No Burial",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267729.jpg"
    },
    {
        "idAlbumSputnik": "262829",
        "artistName": "Yung Lean",
        "albumName": "Stranger",
        "note": "3.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262829.jpg"
    },
    {
        "idAlbumSputnik": "268885",
        "artistName": "Equiknoxx",
        "albumName": "ColÃ³n Man",
        "note": "3.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268885.jpg"
    },
    {
        "idAlbumSputnik": "263628",
        "artistName": "Noel Gallagher's High Flying Birds",
        "albumName": "Who Built the Moon?",
        "note": "3.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/263628.jpg"
    },
    {
        "idAlbumSputnik": "270020",
        "artistName": "Under The Church",
        "albumName": "Supernatural Punishment",
        "note": "3.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/270020.jpg"
    },
    {
        "idAlbumSputnik": "268817",
        "artistName": "At the Drive-In",
        "albumName": "DiamantÃ©",
        "note": "3.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268817.jpg"
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
        "note": "3.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265167.jpg"
    },
    {
        "idAlbumSputnik": "268030",
        "artistName": "88GLAM",
        "albumName": "88GLAM",
        "note": "3.1",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268030.jpg"
    },
    {
        "idAlbumSputnik": "267736",
        "artistName": "Burial",
        "albumName": "Pre Dawn/Indoors",
        "note": "3.1",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267736.jpg"
    },
    {
        "idAlbumSputnik": "268982",
        "artistName": "Bring Me The Horizon",
        "albumName": "2004-2013",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268982.jpg"
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
        "idAlbumSputnik": "260674",
        "artistName": "Oh Sees",
        "albumName": "Memory Of A Cut Off Head",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260674.jpg"
    },
    {
        "idAlbumSputnik": "268348",
        "artistName": "Eluvium",
        "albumName": "Shuffle Drones",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268348.jpg"
    },
    {
        "idAlbumSputnik": "267810",
        "artistName": "M.E.S.H.",
        "albumName": "Hesaitix",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267810.jpg"
    },
    {
        "idAlbumSputnik": "268076",
        "artistName": "Cyhi The Prynce",
        "albumName": "No Dope On Sundays",
        "note": "3.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268076.jpg"
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
        "idAlbumSputnik": "264255",
        "artistName": "Sam Smith",
        "albumName": "The Thrill of It All",
        "note": "2.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/264255.jpg"
    },
    {
        "idAlbumSputnik": "261869",
        "artistName": "Annihilator",
        "albumName": "For the Demented",
        "note": "2.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/261869.jpg"
    },
    {
        "idAlbumSputnik": "268819",
        "artistName": "Emery",
        "albumName": "Revival: Emery Classics Reimagined",
        "note": "2.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268819.jpg"
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
        "idAlbumSputnik": "259591",
        "artistName": "Anti-Flag",
        "albumName": "American Fall",
        "note": "2.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/259591.jpg"
    },
    {
        "idAlbumSputnik": "267805",
        "artistName": "Greta Van Fleet",
        "albumName": "From the Fires",
        "note": "2.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267805.jpg"
    },
    {
        "idAlbumSputnik": "268519",
        "artistName": "Jaden Smith",
        "albumName": "Syre",
        "note": "2.9",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268519.jpg"
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
        "idAlbumSputnik": "269203",
        "artistName": "Fabolous and Jadakiss",
        "albumName": "Friday On Elm Street",
        "note": "2.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/269203.jpg"
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
        "idAlbumSputnik": "268089",
        "artistName": "Nekrasov",
        "albumName": "The Mirror Void",
        "note": "2.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268089.jpg"
    },
    {
        "idAlbumSputnik": "268818",
        "artistName": "The Body",
        "albumName": "A Home on Earth",
        "note": "2.5",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268818.jpg"
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
        "note": "2.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265490.jpg"
    },
    {
        "idAlbumSputnik": "262625",
        "artistName": "Morrissey",
        "albumName": "Low In High School",
        "note": "2.3",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/262625.jpg"
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
        "idAlbumSputnik": "268550",
        "artistName": "Blackbear",
        "albumName": "cybersex",
        "note": "2.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/268550.jpg"
    },
    {
        "idAlbumSputnik": "260101",
        "artistName": "Taylor Swift",
        "albumName": "Reputation",
        "note": "2.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/260101.jpg"
    },
    {
        "idAlbumSputnik": "267023",
        "artistName": "Black Malachite",
        "albumName": "Torn Soul",
        "note": "2.2",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/267023.jpg"
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
        "idAlbumSputnik": "265319",
        "artistName": "Sia",
        "albumName": "Everyday Is Christmas",
        "note": "2.0",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/265319.jpg"
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
        "note": "1.8",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/266344.jpg"
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
        "idAlbumSputnik": "248401",
        "artistName": "Iggy Azalea",
        "albumName": "Digital Distortion",
        "note": "1.6",
        "releaseMonth": "November 2017",
        "imagePath": "http://www.sputnikmusic.com/images/albums/248401.jpg"
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
    }
];

function seedDB(){
    //remove all albums
    Album.remove({}, (err) => {
      if (err){
          console.log(err);
      }
      //add a few albums
        data.forEach((seed) => {
            Album.create(seed, (err, album) => {
                if(err){
                    console.log(err);
                } else{
                    album.save();
                }
            });
        });
    });


}


module.exports = seedDB;
