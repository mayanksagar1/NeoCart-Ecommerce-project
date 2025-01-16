import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {useGetPaypalClientIDQuery, usePayOrderMutation} from "../../redux/api/orderApiSlice.js";
import {clearCart} from "../../redux/features/cart/cartSlice.js";
import {useClearCartMutation} from "../../redux/api/cartApiSlice.js";
import Loader from "../../components/Loader.jsx";
import {toast} from "react-toastify";

const PayPal = ({orderDetails, handleBack, handleNext}) => {
  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

  const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPaypalClientIDQuery();

  const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();

  const dispatch = useDispatch();
  const [clearCartApi] = useClearCartMutation();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        console.log("PayPal options reset with clientId:", paypal.clientId);
        paypalDispatch({type: "setLoadingStatus", value: "pending"});
      };

      if (orderDetails && !orderDetails.isPaid && !isPending) {
        if (!window.paypal && paypal.clientId) {
          loadPayPalScript();
        }
      }
    }
    if (errorPayPal) {
      console.error("PayPal Error:", errorPayPal);
    }
  }, [errorPayPal, loadingPayPal, paypal, paypalDispatch]);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: orderDetails.totalPrice.toFixed(2), // Ensure value is a string
              currency_code: "USD", // Use `currency_code` here
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      })
      .catch((err) => console.log("Error creating paypal order", err));
  };

  const onApprove = (data, actions) => {
    return actions.order
      .capture()
      .then(async function (details) {
        try {
          await payOrder({orderId: orderDetails._id, details});
          dispatch(clearCart());
          await clearCartApi();
          toast.success("Order is paid");
          handleNext();
        } catch (error) {
          toast.error(error?.data?.message || error.message);
        }
      })
      .catch((err) => console.log("error on approve", err));
  };

  const onError = (err) => {
    console.error("PayPal Checkout Error:", err);
    toast.error("Something went wrong with the PayPal transaction.");
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold mb-6">Payment</h1>
      <div className="space-y-4">
        {loadingPay && <Loader />}
        <PayPalButtons
          style={{layout: "vertical"}}
          onCancel={() => {
            console.warn("PayPal popup closed by the user.");
            // Update the UI or notify the user
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
        />
      </div>
      <div className="flex justify-between mt-6">
        <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400" onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default PayPal;
