import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import "./MakeListing.css";

const MakeListing = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    headline: "",
    description: "",
    cleanliness: "",
    overnightGuests: "",
    partyHabits: "",
    getUpTime: "",
    goToBed: "",
    smoker: "",
    foodPreference: "",
    smokePreference: "",
    preferredPets: [],
    buildingType: "",
    rent: 0,
    moveInFee: 0,
    utilityFee: 0,
    isFurnished: false,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    document.body.classList.add("bg-apartment");
    return () => {
      document.body.classList.remove("bg-apartment");
    };
  }, []);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    setIsUpdating(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        setIsUpdating(false);
      },
      () => {
        setImageError(false);
        setIsUpdating(false);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, apartmentImage: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    setImageError(false);
    setImagePercent(0);
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/listings/create/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        setFormError(data.message);
        setUpdateSuccess(false);
        setIsUpdating(false);
        return;
      }

      setUpdateSuccess(true);
      setIsUpdating(false);
      setFormData({
        address: "",
        headline: "",
        description: "",
        cleanliness: "",
        overnightGuests: "",
        partyHabits: "",
        getUpTime: "",
        goToBed: "",
        smoker: "",
        foodPreference: "",
        smokePreference: "",
        preferredPets: [],
        buildingType: "",
        rent: 0,
        moveInFee: 0,
        utilityFee: 0,
        isFurnished: false,
      });

      // Show a success alert or modal
      alert("Listing has been created and updated successfully!");
    } catch (error) {
      console.log(error.message);
      setFormError(error.message);
      setUpdateSuccess(false);
      setIsUpdating(false);
    }
  };

  const handleChange = (event) => {
    const { id, type, checked, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxGroupChange = (event) => {
    const { value } = event.target;
    setFormData(prevFormData => {
      const updatedPets = prevFormData.preferredPets.includes(value)
        ? prevFormData.preferredPets.filter(item => item !== value)
        : [...prevFormData.preferredPets, value];
  
      return { ...prevFormData, preferredPets: updatedPets };
    });
  };
  
  return (
    <div>
      <div className="listing-container mt-10 mb-10 w-full md:max-w-xl mx-auto rounded-lg">
        <div className="flex flex-col items-center justify-center p-2">
          <h1 className="font-semibold text-red-700 text-2xl sm:text-3xl mb-4">
            Your Roommate listing.. Fight On ✌️
          </h1>

          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="text"
              placeholder="Your Address"
              id="address"
              className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg mb-6 text-lg"
              autoComplete="off"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <div className="mb-4 w-full">
              <label
                htmlFor="headline"
                className="block text-lg font-bold mb-2 text-left"
              >
                Headline
              </label>
              <input
                id="headline"
                placeholder="Headline"
                type="text"
                value={formData.headline}
                onChange={handleChange}
                className="bg-slate-100 text-slate-900 shadow appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline text-xl"
                maxLength="35"
                autoComplete="off"
                required
              />
              <p className="text-gray-600 text-xs italic">
                {formData.headline.length}/35
              </p>
            </div>
            <div className="mb-4 relative w-full">
              <label
                htmlFor="description"
                className="block text-lg font-bold mb-2 text-left"
              >
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-slate-900 leading-tight focus:outline-none focus:shadow-outline"
                maxLength="2000"
                rows="5"
                autoComplete="off"
                required
              ></textarea>
              <p className="text-gray-600 text-xs italic absolute right-3 bottom-3">
                {formData.description.length}/2000
              </p>
            </div>
            <div className="w-full space-y-4">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-red-700">
                Lifestyle
              </h2>

              <div className="w-full mb-4">
                <label
                  htmlFor="cleanliness"
                  className="block text-lg font-bold mb-2"
                >
                  My Cleanliness
                </label>
                <select
                  id="cleanliness"
                  name="cleanliness"
                  value={formData.cleanliness}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
                >
                  {/* Add options for cleanliness */}
                  <option value="">Select</option>
                  <option value="tidy">Tidy</option>
                  <option value="average">Average</option>
                  <option value="messy">Messy</option>
                </select>
              </div>

              {/* Overnight guests */}
              <div className="w-full mb-4">
                <label
                  htmlFor="overnightGuests"
                  className="block text-lg font-bold mb-2"
                >
                  Overnight Guests
                </label>
                <select
                  id="overnightGuests"
                  name="overnightGuests"
                  value={formData.overnightGuests}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="never">Never</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="often">Often</option>
                </select>
              </div>

              {/* Party Habits */}
              <div className="w-full mb-4">
                <label
                  htmlFor="partyHabits"
                  className="block text-lg font-bold mb-2"
                >
                  Party Habits
                </label>
                <select
                  id="partyHabits"
                  name="partyHabits"
                  value={formData.partyHabits}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="never">Rarely</option>
                  <option value="sometimes">Weekends</option>
                  <option value="often">Daily</option>
                </select>
              </div>

              {/* Sleep Schedule */}

              <div className="w-full mb-4">
                <label
                  htmlFor="getUpTime"
                  className="block text-lg font-bold mb-2"
                >
                  Get Up
                </label>
                <select
                  id="getUpTime"
                  name="getUpTime"
                  value={formData.getUpTime}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="before6am">Before 6AM</option>
                  <option value="6to8am">6AM - 8AM</option>
                  <option value="8to10am">8AM - 10AM</option>
                  <option value="10to12pm">10AM - 12PM</option>
                  <option value="after12pm">After 12PM</option>
                </select>
              </div>

              <div className="w-full mb-4">
                <label
                  htmlFor="goToBed"
                  className="block text-lg font-bold mb-2"
                >
                  Go To Bed
                </label>
                <select
                  id="goToBed"
                  name="goToBed"
                  value={formData.goToBed}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="before8pm">Before 8PM</option>
                  <option value="8to10pm">8PM - 10PM</option>
                  <option value="10to12am">10PM - 12AM</option>
                  <option value="12to2am">12AM - 2AM</option>
                  <option value="after2am">After 2AM</option>
                </select>
              </div>

              <div className="w-full mb-4">
                <label
                  htmlFor="smoker"
                  className="block text-lg font-bold mb-2"
                >
                  Smoker
                </label>
                <select
                  id="smoker"
                  name="smoker"
                  value={formData.smoker}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="nonSmoker">Non-smoker</option>
                  <option value="smoker">Smoker</option>
                  <option value="outsideSmoker">Outside smoker</option>
                </select>
              </div>
            </div>

            <div className="w-full mt-4 mb-4">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-red-700">
                Roomate Preferences
              </h2>
              <label
                htmlFor="foodPreference"
                className="block text-lg font-bold mb-2"
              >
                Food Preference
              </label>
              <select
                id="foodPreference"
                name="foodPreference"
                value={formData.foodPreference}
                onChange={handleChange}
                required
                className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
              >
                <option value="">Select</option>
                <option value="anything">Almost Anything</option>
                <option value="fish">Fish Only</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="kosher">Kosher</option>
              </select>
            </div>
            {/* Smoke Preference Dropdown */}
            <div className="w-full mb-4">
              <label
                htmlFor="smokePreference"
                className="block text-lg font-bold mb-2"
              >
                Smoke Preference
              </label>
              <select
                id="smokePreference"
                name="smokePreference"
                value={formData.smokePreference}
                onChange={handleChange} // Assuming you have a generic handleChange method
                className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
              >
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="outside">Outside only</option>
              </select>
            </div>
            {/* Pet Preference Checkboxes */}
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">
                Pets Preference
              </label>
              <div className="flex flex-wrap gap-2">
                {["Cats", "Dogs", "Small Pets", "Birds", "Fish"].map((pet) => (
                  <label
                    key={`preference-${pet}`}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      value={pet.toLowerCase()}
                      checked={formData.preferredPets.includes(
                        pet.toLowerCase()
                      )}
                      onChange={handleCheckboxGroupChange}
                      name="preferredPets"
                      id={`preferredPets-${pet.toLowerCase()}`} // Unique ID for each checkbox
                      className="form-checkbox h-5 w-5 text-gray-600"
                    />
                    <span>{pet}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="w-full p-5 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-red-700">
                Building Information
              </h2>
              {/* Building Type Dropdown */}
              <div className="w-full mb-4">
                <label
                  htmlFor="buildingType"
                  className="block text-lg font-bold mb-2"
                >
                  Building type
                </label>
                <select
                  id="buildingType"
                  name="buildingType"
                  value={formData.buildingType}
                  onChange={handleChange} // Make sure to implement handleChange to update the state
                  className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="townHouse">Town House</option>
                </select>
              </div>

              {/* Numeric Inputs */}

              <div className="mb-4">
                <label htmlFor="rent" className="block text-lg font-bold mb-2">
                  Apartment Rent
                </label>
                <input
                  type="number"
                  id="rent"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="moveInFee"
                  className="block text-lg font-bold mb-2"
                >
                  Move-in fee
                </label>
                <input
                  type="number"
                  id="moveInFee"
                  name="moveInFee"
                  value={formData.moveInFee}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="utilityFee"
                  className="block text-lg font-bold mb-2"
                >
                  Utility Fee
                </label>
                <input
                  type="number"
                  id="utilityFee"
                  name="utilityFee"
                  value={formData.utilityFee}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
                  min="0"
                />
              </div>

              {/* Furnished Toggle */}
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="isFurnished" className="text-lg font-bold">
                  Furnished
                </label>
                <input
                  type="checkbox"
                  id="isFurnished"
                  name="isFurnished"
                  checked={formData.isFurnished}
                  onChange={(e) =>
                    setFormData({ ...formData, isFurnished: e.target.checked })
                  }
                  className="form-checkbox h-5 w-5 text-gray-600"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="apartmentImage"
                  className="block text-lg font-bold mb-2"
                >
                  Upload Apartment Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="apartmentImage"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg"
                />
              </div>
              <p className="text-sm self-center mb-4">
                {imageError ? (
                  <span className="text-red-700">
                    Error uploading image (file size must be less than 2 MB)
                  </span>
                ) : imagePercent > 0 && imagePercent < 100 ? (
                  <span className="text-slate-100">{`Uploading: ${imagePercent} %`}</span>
                ) : imagePercent === 100 ? (
                  <span className="text-green-700">
                    Image uploaded successfully
                  </span>
                ) : (
                  ""
                )}
              </p>
            </div>

            <button
              type="submit"
              className={`bg-slate-700 item-center text-white rounded-md mb-4 w-1/2 h-12 text-lg sm:text-xl hover:opacity-90 ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Make a Listing"}
            </button>
          </form>
        </div>
        <p className="text-red-700 mt-5">{formError ? formError : ""}</p>
        <p className="text-green-700 mt-5">
          {updateSuccess && "Listing Created Successfully!!"}
        </p>
      </div>
    </div>
  );
};

export default MakeListing;
