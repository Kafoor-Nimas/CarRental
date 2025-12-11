import Car from "../models/car.js";

import User from "../models/user.js";

//API to change role of user
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to list car

export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;

    // 1. Check if the file uploaded successfully
    if (!req.file) {
      return res.json({
        success: false,
        message: "Image upload failed or no image provided",
      });
    }

    // 2. Get the Cloudinary URL
    // Multer/Cloudinary puts the URL in req.file.path automatically
    const imageUrl = req.file.path;

    // 3. Parse your car data
    let carData = JSON.parse(req.body.carData);

    // 4. Create the car entry in MongoDB
    const newCar = await Car.create({
      ...carData,
      owner: _id,
      image: imageUrl,
    });

    res.json({ success: true, message: "Car Added", car: newCar });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to list specific Owner Cars

export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to toggle Car Availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    //Checking is car belongs to the user
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    car.isAvailable = !car.isAvailable;
    await car.save();
    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
