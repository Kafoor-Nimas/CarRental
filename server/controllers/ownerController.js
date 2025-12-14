import Booking from "../models/Booking.js";
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

//API to delete car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    //Checking is car belongs to the user
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    //we can not delete this data because if someone booked this car in the past if we delete this car it also delete old booking list car details
    car.owner = null;
    car.isAvailable = false;
    await car.save();
    res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: exrror.message });
  }
};

//API to get Dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }
    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });
    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });
    const completedBookings = await Booking.find({
      owner: _id,
      status: "confirmed",
    });
    //Calculate monthly revenue from bookings where status is confirmed
    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => booking.status === "confirmed")
      .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBooking: bookings.slice(0, 3),
      monthlyRevenue,
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to update user image

export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    // 1. Check if file exists
    if (!req.file) {
      return res.json({
        success: false,
        message: "Image upload failed or no image provided",
      });
    }
    // 2. Get the Cloudinary URL
    const imageUrl = req.file.path;

    // 3. Update the user's image in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { image: imageUrl },
      { new: true } // Returns the updated document
    );

    res.json({
      success: true,
      message: "Profile image updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
