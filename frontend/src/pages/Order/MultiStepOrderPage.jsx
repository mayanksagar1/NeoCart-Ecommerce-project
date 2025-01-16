import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {useFetchAddressesQuery, useCreateAddressMutation} from "../../redux/api/addressApiSlice";
import {useCreateOrderMutation} from "../../redux/api/orderApiSlice";
import PayPal from "./PayPal";
import {toast} from "react-toastify";
import AddressFormModal from "../User/AddressFromModal";

const MultiStepOrderPage = () => {
  const {userInfo} = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);

  // steps used in the progress bar/steps tracker
  const steps = ["Address", "Order Summary", "Payment", "Confirmation"];

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // fetching addresses to show in the select addresses section
  const {data: addresses, refetch: refetchAddresses} = useFetchAddressesQuery(userInfo?._id);
  // destructing query for creating a new address
  const [createAddress, {isLoading: isCreatingAddress}] = useCreateAddressMutation();
  // initialState for the form used in creating a new address;
  const initialAddressFormState = {
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India", // Default value
    isDefault: false,
  };
  // state for the form used in creating a new address;
  const [addressFormData, setAddressFormData] = useState(initialAddressFormState);
  // handles the on close for address form modal
  const handleAddressModalClose = () => {
    setAddressFormData(initialAddressFormState);
    setIsAddressModalOpen(false);
  };

  // creates a new address from the data received
  const handleCreateAddress = async () => {
    if (addressFormData.isDefault === true) {
      const haveDefault = addresses.filter((address) => address.isDefault === true);
      if (haveDefault.length > 0 && haveDefault[0]._id !== addressFormData._id) {
        return toast.error("There is already a default address!");
      }
    }
    try {
      const res = await createAddress({userId: userInfo._id, data: addressFormData}).unwrap();
      handleAddressModalClose();
      refetchAddresses();
      toast.success("Address added successfully!");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || "Failed to add address.");
    }
  };

  // function for calculating the different prices in order summary
  const calcPrices = (cartItems) => {
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = +(itemsPrice * 0.15).toFixed(2);
    const totalPrice = +(itemsPrice + shippingPrice + taxPrice).toFixed(2);
    return {itemsPrice, shippingPrice, taxPrice, totalPrice};
  };
  // destructuring the prices from called function;
  const {itemsPrice, shippingPrice, taxPrice, totalPrice} = calcPrices(cart.cartItems);

  // for handling the going back and forward
  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const [createOrderDB, {isLoading: creatingOrder, isSuccess: successfullyCreated}] = useCreateOrderMutation();

  const handleCreateOrder = async () => {
    try {
      const orderItems = cart.cartItems.map((item) => {
        const product = item.product._id;
        const name = item.product.name;
        const quantity = item.quantity;
        const price = item.price;
        const image = item.product.images[0];
        return {product, name, price, quantity, image};
      });
      const shippingAddress = {
        fullName: selectedAddress.fullName,
        address: selectedAddress.address,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        phone: selectedAddress.phone,
        city: selectedAddress.city,
        country: selectedAddress.country,
      };
      const paymentMethod = "PayPal";
      const res = await createOrderDB({orderItems, shippingAddress, paymentMethod}).unwrap();
      setOrderDetails(res);
      handleNext();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Steps Tracker */}
      <div className="hidden md:flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center relative">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${index <= currentStep ? "bg-green-600" : "bg-gray-300"}`}>{index + 1}</div>
            <span className="ml-2 text-sm font-medium">{step}</span>
            {index < steps.length - 1 && <div className={`h-1 w-16 ml-5 ${index < currentStep ? "bg-green-600" : "bg-gray-300"}`}></div>}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 0 && (
        <div className="p-6 bg-white border rounded-lg shadow-lg">
          <h1 className="text-xl font-semibold mb-6">Select Address</h1>
          <div className="space-y-4">
            {addresses &&
              addresses.map((address) => (
                <div
                  key={address._id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer ${selectedAddress === address ? "border-pink-500 bg-pink-50" : "border-gray-300"}`}
                  onClick={() => setSelectedAddress(address)}>
                  <input type="radio" name="address" className="mr-3" checked={selectedAddress === address} onChange={() => setSelectedAddress(address)} />
                  <div className={` `}>
                    <span className="">
                      <strong>{address.fullName}</strong>
                    </span>
                    <p className="text-sm">
                      <strong>Phone:</strong> {address.phone}
                    </p>
                    <p className="text-sm text-wrap">{address.address}</p>
                    <p className="text-sm">
                      {address.city}, {address.state}, {address.postalCode}
                    </p>
                    <p className="text-sm">{address.country}</p>
                    {address.isDefault && <span className="text-xs text-green-500 font-medium">Default Address</span>}
                  </div>
                </div>
              ))}
          </div>
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="w-full p-3 text-center border font-medium border-violet-500 bg-violet-50 text-violet-500 hover:text-violet-600 hover:font-semibold mt-4 rounded-lg">
            Add new address
          </button>
          <button
            disabled={!selectedAddress}
            className={`mt-6 w-full py-2 rounded-lg ${selectedAddress ? "bg-pink-500 text-white hover:bg-pink-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            onClick={handleNext}>
            Proceed to Order Summary
          </button>
          <AddressFormModal
            isOpen={isAddressModalOpen}
            isCreating={isCreatingAddress}
            isUpdating={false}
            onClose={handleAddressModalClose}
            handleSubmit={handleCreateAddress}
            values={addressFormData}
            setValues={setAddressFormData}
          />
        </div>
      )}

      {currentStep === 1 && (
        <div className="p-3 md:p-6 bg-white border rounded-lg shadow-lg">
          <h1 className="text-xl font-semibold mb-6">Order Summary</h1>
          <ul className="divide-y divide-gray-200 mb-6">
            {cart.cartItems.map((item) => (
              <li key={item.product._id} className="flex justify-between items-center py-4">
                <Link to={`/product/${item.product._id}`} className="flex items-center gap-3">
                  <img src={item.product.images[0]} className="h-16 w-16 object-cover rounded" alt={item.product.name} />
                  <p className="text-pink-600 max-w-[60%] md:max-w-full hover:underline">{item.product.name}</p>
                </Link>
                <span className="text-gray-800">
                  {item.quantity} x ${item.price}
                </span>
              </li>
            ))}
          </ul>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-800">Items :</span>
              <span className="font-semibold">$ {itemsPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-800">Shipping :</span>
              <span className="font-semibold">$ {shippingPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-800">Tax :</span>
              <span className="font-semibold">$ {taxPrice}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-2">
              <span className="text-gray-800">Total :</span>
              <span className="text-xl">$ {totalPrice}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400" onClick={handleBack}>
              Back
            </button>
            <button className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600" onClick={handleCreateOrder}>
              Proceed to Payment
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && orderDetails && (
        <>
          <PayPal orderDetails={orderDetails} handleBack={handleBack} handleNext={handleNext} />
        </>
      )}

      {currentStep === 3 && (
        <div className="p-6 bg-white border rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-6">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">Thank you for your order.</p>
          <p className="text-gray-600">Order ID: {orderDetails._id}</p>
          <p className="text-gray-600">Total Amount: ${orderDetails.totalPrice}</p>
          <button className="mt-6 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition" onClick={() => (window.location.href = "/")}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiStepOrderPage;
