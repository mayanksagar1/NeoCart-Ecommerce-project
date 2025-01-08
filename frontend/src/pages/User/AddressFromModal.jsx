import {FaTimes} from "react-icons/fa";
import BtnLoader from "../../components/BtnLoader";

const AddressFormModal = ({isOpen, onClose, isCreating, isUpdating, handleSubmit, values, setValues}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const {name, value} = e.target;
    setValues({...values, [name]: value});
  };

  const handleDefaultChange = (e) => {
    setValues({...values, isDefault: e.target.value === "true"});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 shadow-lg relative">
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl" onClick={onClose}>
          <FaTimes size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">{values._id ? "Edit Address" : "Add New Address"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" name="fullName" value={values.fullName || ""} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone no.</label>
            <input type="text" name="phone" value={values.phone || ""} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input type="text" name="address" value={values.address || ""} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div className="flex gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input type="text" name="city" value={values.city || ""} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
            </div>
            {/* State */}
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input type="text" name="state" value={values.state || ""} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
            </div>
          </div>

          <div className="flex gap-4">
            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium mb-1">Postal Code</label>
              <input type="text" name="postalCode" value={values.postalCode || ""} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
            </div>
            {/* Country */}
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input type="text" name="country" value={values.country || ""} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
            </div>
          </div>
          {/* Default Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Set as Default Address</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input type="radio" name="isDefault" value="true" checked={values.isDefault === true} onChange={handleDefaultChange} className="mr-2" />
                Yes
              </label>
              <label className="flex items-center">
                <input type="radio" name="isDefault" value="false" checked={values.isDefault === false} onChange={handleDefaultChange} className="mr-2" />
                No
              </label>
            </div>
          </div>
          {/* Submit Button */}
          <button type="submit" disabled={isCreating || isUpdating} className="bg-indigo-500  text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition">
            {isCreating || isUpdating ? <BtnLoader /> : <>{values._id ? "Update Address" : "Add Address"}</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;
