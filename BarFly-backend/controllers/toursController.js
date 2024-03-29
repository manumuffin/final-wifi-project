import mongoose from "mongoose";
import { validationResult, matchedData } from "express-validator";

import { Tour } from '../models/toursModel.js';
import { Location } from '../models/locationModel.js';

import HttpError from "../models/http-errors.js";

import {
    deleteFile,
    sendFileToCloudinary,
    deleteFileInCloudinary
} from "../common/index.js";

const createTour = async (req, res, next) => {
    // express-validator
  const result = validationResult(req);

  const formData = req.body;
  console.log(formData);

  // object ids: string operation
  // locations array erzeugen

  const locations = req.body.locations.split(';');
  console.log(locations);

  // destructuring owner id
  const { id } = req.params;

  // error message to client
  if (result.errors.length > 0) {
    deleteFile(req.file.path);
    return next(new HttpError(JSON.stringify(result), 422));
  }

  const matchData = matchedData(req);
  console.log(matchData);

  //error if there is no image
  if (!req.file) {
    return next(new HttpError("Photo is missing", 422));
    // 
    // wenn kein foto hochgeladen, dann das profilbild der ersten location in der tour auswählen
    // 
  }

  // saving image to cloudinary
  const response = await sendFileToCloudinary(req.file.path, "BarFly");

  const photo = {
    cloudinaryPublicId: response.public_id,
    url: response.secure_url,
  };

  const createdTour = new Tour({
    // req.body enthält ungeprüftes statement, das vom express-validator ignoriert wird; matchData überschreibt mit geprüften Daten
    ...req.body,
    ...matchData,
    locations,
    photo
  });

  let newTour;

  try {
  newTour = await createdTour.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, error));
  }

  res.send(newTour);
};

const getAllTours = async (req, res) => {
  const tours = await Tour.find({}).populate('locations');
  res.json(tours);
};

const getOneTour = async (req, res, next) => {
  let tour;

  try {
    tour = await Tour.findById(req.params.id).populate('locations');
  } catch (error) {
    return next(new HttpError("Cant find tour", 404));
  }

  res.json(tour);
};


const editTour = async (req, res, next) => {
  // 
  // id muss tour id sein, weil darüber in collection gesucht wird
  const { id } = req.params;

  const result = validationResult(req);

  if (result.errors.length > 0) {
    return next(new HttpError(JSON.stringify(result), 422));
  }

  const matchData = matchedData(req);

  // search for tour
  // 
  // 
  // TODO: warum 2x fehler catchen???
  let tour;
  try {
    tour = await Tour.findById(id);
    if (!tour) {
      return next(new HttpError('Cant find tour', 404));
    }
  } catch (error) {
    return next(new HttpError('Cant find tour', 404));
  }

  Object.assign(tour, matchData);

  // replacing image if there's one
  if (req.file) {
    
    // uploading new image
    const response = await sendFileToCloudinary(req.file.path, 'BarFly');

    // deleting old image
    await deleteFileInCloudinary(location.photo.cloudinaryPublicId);

    tour.photo = {
      cloudinaryPublicId: response.public_id,
      url: response.secure_url,
    };
  }

  // 
  // geo/ address in tour ???
  // 

  // // recalculate geo data
  // const address = location.street + ', ' + location.zip + ' ' + location.city;
  // user.geo = await getGeolocation(address);

  const changedTour = await tour.save();

  // send new user object
  res.json(changedTour);
};


const deleteTour = async (req, res, next) => {
  const { id } = req.params;

  console.log(req.verifiedUser);
  
  // find tour
  let tour;
  try {
    tour = await Tour.findById(id);
    if (!tour) {
      return next(new HttpError('Cant find tour', 404));
    }
  } catch (error) {
    return next(new HttpError('Cant find tour', 404));
  }

  // deleting everything attached to tour:

  const publicId = tour.photo.cloudinaryPublicId;


  try {
    // starting session and transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    
    // delete in user's favouriteTours

  
    //  delete tour
    await tour.deleteOne({ session });

    // confirm transaction
    await session.commitTransaction();

    // delete image in cloudinary
    await deleteFileInCloudinary(publicId);
  } catch (error) {
    console.log('error is: ', error);
    return next(new HttpError('error while deleting', 500));
  }

  res.send('tour deleted successfully');
};

const generateTour = async(req, res, next) => {
  // validate form data (name, city(choose from list), numStations, array of categories(categories added by configured buttons))
  // description checked in matchedData

  const result = validationResult(req);

  if (result.errors.length > 0) {
    return next(new HttpError(JSON.stringify(result), 422));
  }

  const matchData = matchedData(req);

  console.log(matchData);

  const { categoryArr } = matchData;
  

  // save each in variables

  const numStations = 3;
 
  let filteredBars = [];

  try{
  // filter for bars in selected city (for now it's only Vienna)
  filteredBars = await Location.find({ city: 'Wien' });

  // randomize filteredBars

  } catch (error) {
    console.log(error);
    return next(new HttpError("Server error", 500));
  }
  
  let finalTours = [];
  let oneTour = [];

  // while there are enough filtered bars to create a tour,
  for (let k=numStations; k < filteredBars.length; k += 0) {

  for (let j=0; j < numStations; j += 1) {
    // check for all selected categories in the selected number of filtered bars
  for (let i=0; i < categoryArr.length; i+= 1) {
    let selectedCategory = categoryArr[i];
    
    console.log(selectedCategory);
    
    const resultBar = filteredBars.find(obj => obj.categories.includes(selectedCategory));
    console.log(resultBar);
  // if there is a match of selected and bar category, the bar gets added to the tour
    if(resultBar) {
      oneTour.push(resultBar);
      // removing bar to avoid duplicates
      filteredBars.splice(filteredBars.indexOf(resultBar), 1);
     }
    }
  }
  // add tour to the list of alternatives
  finalTours.push(oneTour);
}

  console.log(finalTours);
 
  res.send(finalTours);

};

export { createTour, getAllTours, getOneTour, editTour, deleteTour, generateTour };