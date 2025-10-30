// Import Album Model
const Album = require('../models/album.model');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const SUCCESS_STATUS = 200;
const ERROR_STATUS = 400;
const CREATED_STATUS = 201;
const NOT_FOUND_STATUS = 404;
const DELETED_STATUS = 204;

const handleResponse = (res, status, data, message, error) => {
  const response = { status, message };
  if (data) response.data = data;
  if (error) response.error = error;
  return res.status(status).json(response);
};

const buildSearchQuery = (searchItem, scope, sources) => {
  const searchAlbums = { albumName: { $regex: searchItem, $options: 'i' } };
  const searchArtists = { artistName: { $regex: searchItem, $options: 'i' } };
  const searchAllTypes = { $or: [searchArtists, searchAlbums] };

  const searchSources = sources === "sputnikMusic" ? { sputnikMusic: { $exists: true } } :
                        sources === "hbih" ? { heavyBIsH: { $exists: true } } :
                        sources === "ylr" ? { yourLastRites: { $exists: true } } : {};

  let query = scope === "albums" ? searchAlbums : scope === "artists" ? searchArtists : searchAllTypes;

  if (Object.keys(searchSources).length > 0) {
    Object.assign(query, searchSources);
  }

  return query;
};

exports.getAlbums = async function getAlbums(req, res, next) {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;

  const options = {
    page,
    limit,
    sort: { 'sortDate.year': -1, 'sortDate.month': -1, 'sortDate.day': -1 }
  };

  try {
    const albums = await Album.paginate({}, options);
    return handleResponse(res, SUCCESS_STATUS, albums, "Albums Successfully Fetched");
  } catch (e) {
    return handleResponse(res, ERROR_STATUS, null, e.message);
  }
};

exports.search = async function search(req, res, next) {
  const { q: searchItem, scope, sources, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;

  const options = {
    page,
    limit,
    sort: { 'sortDate.year': -1, 'sortDate.month': -1, 'sortDate.day': -1 }
  };

  try {
    const query = buildSearchQuery(searchItem, scope, sources);
    const foundAlbums = await Album.paginate(query, options);

    if (!foundAlbums.docs.length) {
      return handleResponse(res, SUCCESS_STATUS, [], "No albums found");
    }

    return handleResponse(res, SUCCESS_STATUS, foundAlbums, "Search Successful");
  } catch (error) {
    return handleResponse(res, ERROR_STATUS, null, "Error while searching", error.message);
  }
};

exports.createAlbum = async function createAlbum(req, res, next) {
  const { album: albumData } = req.body;

  const newAlbum = new Album(albumData);

  try {
    const createdAlbum = await newAlbum.save();
    return handleResponse(res, CREATED_STATUS, createdAlbum, "Album Successfully Created");
  } catch (e) {
    return handleResponse(res, ERROR_STATUS, null, "Album Creation was Unsuccessful", e.message);
  }
};

exports.updateAlbum = async function updateAlbum(req, res, next) {
  const { _id: id, ...albumData } = req.body;

  if (!id) {
    return handleResponse(res, ERROR_STATUS, null, "Id must be present");
  }

  try {
    let albumToUpdate = await Album.findById(id);

    if (!albumToUpdate) {
      return handleResponse(res, NOT_FOUND_STATUS, null, "Album not found");
    }

    Object.assign(albumToUpdate, albumData);
    albumToUpdate.lastModified = new Date();

    const updatedAlbum = await albumToUpdate.save();
    return handleResponse(res, SUCCESS_STATUS, updatedAlbum, "Album Successfully Updated");
  } catch (e) {
    return handleResponse(res, ERROR_STATUS, null, "Error while updating album", e.message);
  }
};

exports.removeAlbum = async function removeAlbum(req, res, next) {
  const { id } = req.params;

  try {
    const result = await Album.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new Error("Album could not be deleted");
    }

    return handleResponse(res, DELETED_STATUS, null, "Album Successfully Deleted");
  } catch (e) {
    return handleResponse(res, ERROR_STATUS, null, e.message);
  }
};
