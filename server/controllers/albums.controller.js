// Import Album Model
const Album = require('../models/album.model');

// Async Controller function to get the Albums List
exports.getAlbums = async function getAlbums(req, res, next) {
  const page = req.query.page ? +req.query.page : 1;
  const limit = req.query.limit ? +req.query.limit : 20;

  const options = {
    page,
    limit,
    sort: { 'sortDate.year': -1, 'sortDate.month': -1, 'sortDate.day': -1 }
  };

  try {
    const albums = await Album.paginate({}, options);
    return res.status(200).json({ status: 200, data: albums, message: "Albums Successfully Received" });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.search = async function search(req, res, next) {
  const searchItem = req.query.q;
  const scope = req.query.scope;
  const sources = req.query.sources;
  const page = req.query.page ? +req.query.page : 1;
  const limit = req.query.limit ? +req.query.limit : 20;

  const options = {
    page,
    limit,
    sort: { 'sortDate.year': -1, 'sortDate.month': -1, 'sortDate.day': -1 }
  };

  try {
    let query = {};
    const searchAlbums = { albumName: { $regex: searchItem, $options: 'i' } };
    const searchArtists = { artistName: { $regex: searchItem, $options: 'i' } };
    const searchAllTypes = { $or: [searchArtists, searchAlbums] };

    const searchSources = sources === "sputnikMusic" ? { sputnikMusic: { $exists: true } } :
                          sources === "hbih" ? { heavyBIsH: { $exists: true } } :
                          sources === "ylr" ? { yourLastRites: { $exists: true } } : {};

    query = scope === "albums" ? searchAlbums : scope === "artists" ? searchArtists : searchAllTypes;

    if (Object.keys(searchSources).length > 0) {
      Object.assign(query, searchSources);
    }

    const foundAlbums = await Album.paginate(query, options);

    if (!foundAlbums.docs.length) {
      return res.status(200).json({ status: 200, data: [], message: "No albums found" });
    }

    return res.status(200).json({ status: 200, data: foundAlbums, message: "Search Successful" });

  } catch (error) {
    return res.status(400).json({ status: 400, message: "Error while searching", error: error.message });
  }
};

exports.createAlbum = async function createAlbum(req, res, next) {
  const albumData = req.body.album;

  const newAlbum = new Album({
    artistName: albumData.artistName,
    albumName: albumData.albumName,
    idAlbumSputnik: albumData.idAlbumSputnik,
    imagePath: albumData.imagePath,
    note: albumData.note,
    releaseMonth: albumData.releaseMonth,
  });

  try {
    const createdAlbum = await newAlbum.save();
    return res.status(201).json({ status: 201, data: createdAlbum, message: "Album Successfully Created" });
  } catch (e) {
    return res.status(400).json({ status: 400, message: "Album Creation was Unsuccessful", error: e.message });
  }
};

exports.updateAlbum = async function updateAlbum(req, res, next) {
  const id = req.body._id;

  if (!id) {
    return res.status(400).json({ status: 400, message: "Id must be present" });
  }

  const albumData = req.body;

  try {
    let albumToUpdate = await Album.findById(id);

    if (!albumToUpdate) {
      return res.status(404).json({ status: 404, message: "Album not found" });
    }

    albumToUpdate.artistName = albumData.artistName || albumToUpdate.artistName;
    albumToUpdate.albumName = albumData.albumName || albumToUpdate.albumName;

    if (albumData.sputnikMusic) {
      albumToUpdate.sputnikMusic = albumData.sputnikMusic;
    }

    if (albumData.heavyBIsH) {
      albumToUpdate.heavyBIsH = albumData.heavyBIsH;
    }

    if (albumData.spotify) {
      albumToUpdate.spotify = albumData.spotify;
      const coverImages = albumData.spotify.images || [];
      albumToUpdate.spotify.cover = coverImages.length > 1 ? coverImages[1].url : null;
    }

    if (albumData.yourLastRites) {
      albumToUpdate.yourLastRites = albumData.yourLastRites;
    }

    albumToUpdate.lastModified = new Date();

    const updatedAlbum = await albumToUpdate.save();
    return res.status(200).json({ status: 200, data: updatedAlbum, message: "Album Successfully Updated" });

  } catch (e) {
    return res.status(400).json({ status: 400, message: "Error while updating album", error: e.message });
  }
};

exports.removeAlbum = async function removeAlbum(req, res, next) {
  const id = req.params.id;

  try {
    const result = await Album.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new Error("Album could not be deleted");
    }

    return res.status(204).json({ status: 204, message: "Album Successfully Deleted" });

  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
