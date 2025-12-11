
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
      return res.json({ success: false, message: "Image upload failed or no image provided" });
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
