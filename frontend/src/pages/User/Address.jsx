import {useState} from "react";
import {useFetchAddressesQuery, useCreateAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation} from "../../redux/api/addressApiSlice";
import {useSelector} from "react-redux";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {toast} from "react-toastify";
import {MdEditSquare, MdAdd, MdDeleteOutline} from "react-icons/md";
import AddressFormModal from "./AddressFromModal";
import BtnLoader from "../../components/BtnLoader";

const Address = () => {
  const {userInfo} = useSelector((state) => state.auth);
  const {data: addresses, refetch, isLoading, error} = useFetchAddressesQuery(userInfo._id);
  const [createAddress, {isCreating}] = useCreateAddressMutation();
  const [updateAddress, {isUpdating}] = useUpdateAddressMutation();
  const [deleteAddress, {isDeleting}] = useDeleteAddressMutation();
  const [isModalOpen, setModalOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India", // Default value
    isDefault: false,
  });

  const handleModalClose = () => {
    setFormValues({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India", // Default value
      isDefault: false,
    });
    setModalOpen(false);
  };

  const handleSubmit = () => {
    if (formValues.isDefault === true) {
      const haveDefault = addresses.filter((address) => address.isDefault === true);
      if (haveDefault.length > 0 && haveDefault[0]._id !== formValues._id) {
        return toast.error("There is already a default address!");
      }
    }
    if (formValues._id) {
      handleUpdateAddress();
    } else {
      handleAddAddress();
    }
  };

  const handleUpdateAddress = async () => {
    try {
      const res = await updateAddress({userId: userInfo._id, addressId: formValues._id, data: formValues}).unwrap();
      handleModalClose();
      refetch();
      toast.success("Address updated successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update address");
    }
  };

  const handleAddAddress = async () => {
    try {
      const res = await createAddress({userId: userInfo._id, data: formValues}).unwrap();
      handleModalClose();
      refetch();
      toast.success("Address added successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add address.");
    }
  };

  const handleDeleteAddress = async (e, address) => {
    e.preventDefault();
    try {
      const res = await deleteAddress({userId: userInfo._id, addressId: address._id}).unwrap();
      refetch();
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete address");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant={"error"}>{error?.data?.error || error.message}</Message>;
  }

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Your Addresses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses?.map((address, index) => (
          <div key={index} className={`border rounded-lg p-4 shadow-md ${address.isDefault && " border-indigo-600"} flex flex-col gap-3 justify-between bg-white`}>
            <p className="text-lg font-medium">
              <strong>{address.fullName}</strong>
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> {address.phone}
            </p>
            <p className="text-sm text-wrap">{address.address}</p>
            <p className="text-sm">
              {address.city}, {address.state}, {address.postalCode}
            </p>
            <p className="text-sm">{address.country}</p>
            {address.isDefault && <span className="text-xs text-green-500 font-medium">Default Address</span>}
            <div className="flex justify-between items-center mt-3">
              <button
                className="bg-indigo-500 flex text-white p-2 rounded-lg items-center gap-1 hover:bg-indigo-600 transition"
                onClick={() => {
                  setFormValues(address);
                  setModalOpen(true);
                }}>
                <MdEditSquare size={20} />
                Edit
              </button>
              <button disabled={isDeleting} className="flex p-2 items-center gap-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition" onClick={(e) => handleDeleteAddress(e, address)}>
                {isDeleting ? (
                  <BtnLoader />
                ) : (
                  <>
                    <MdDeleteOutline size={20} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
        {/* Add New Address Card */}
        <div
          className="border rounded-lg p-4  shadow-md flex flex-col justify-center items-center bg-white cursor-pointer hover:shadow-lg transition"
          onClick={() => {
            setModalOpen(true);
          }}>
          <MdAdd size={30} className="text-indigo-500 rounded-full bg-indigo-100" />
          <p className="text-lg font-medium text-indigo-500">Add Address</p>
        </div>
      </div>
      <AddressFormModal isOpen={isModalOpen} isCreating={isCreating} isUpdating={isUpdating} onClose={handleModalClose} handleSubmit={handleSubmit} values={formValues} setValues={setFormValues} />
    </div>
  );
};

export default Address;
