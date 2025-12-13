import Booking from "../models/Booking.js";
import Car from "../models/car.js";

//Function to check Availability of Car for a given date
export const checkAvailability = async (car, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });
  return bookings.length === 0;
};

//API to Check availability of Cars for the given date and location

export const CheckAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;
    //fetch all available car for the given location
    const cars = await Car.find({ location, isAvailable: true });
    //check car availability for the given date range using promise
    const availableCarPromises = cars.map(async (car) => {
      const isAvailableOnThatDate = await checkAvailability(
        car._id,
        pickupDate,
        returnDate
      );
      return { ...car._doc, isAvailable: isAvailableOnThatDate };
    });
    let availableCars = await Promise.all(availableCarPromises);
    availableCars = availableCars.filter((car) => car.isAvailable === true);
    res.json({ success: true, availableCars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
