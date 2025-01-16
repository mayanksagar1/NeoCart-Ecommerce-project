import {useState} from "react";
import {Link} from "react-router-dom";
import Ratings from "./Ratings";
import {BiSolidMessageAltError} from "react-icons/bi";

const ProductTabs = ({loadingProductReview, canReview, userInfo, submitHandler, rating, setRating, comment, setComment, product}) => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row bg-white rounded-lg mt-4 shadow-md">
      {/* Tabs Section */}
      <section className="w-full md:w-1/4 border-b md:border-b-0 md:border-r">
        <div className={`p-4 cursor-pointer text-lg text-center ${activeTab === 1 ? "font-bold bg-slate-100 border-b-4 border-pink-600" : "hover:bg-gray-100"}`} onClick={() => handleTabClick(1)}>
          All Reviews
        </div>
        <div className={`p-4 cursor-pointer text-lg text-center ${activeTab === 2 ? "font-bold bg-slate-100 border-b-4 border-pink-600" : "hover:bg-gray-100"}`} onClick={() => handleTabClick(2)}>
          Write Your Review
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full md:w-3/4 p-4">
        {/* Write Review Tab */}
        {activeTab === 2 && (
          <div className="mt-4">
            {userInfo ? (
              canReview ? (
                <form onSubmit={submitHandler}>
                  <div className="my-4">
                    <label htmlFor="rating" className="block text-lg mb-2">
                      Rating
                    </label>
                    <select id="rating" required value={rating} onChange={(e) => setRating(e.target.value)} className="w-full p-3 border rounded-lg focus:ring focus:ring-pink-200 focus:outline-none">
                      <option value="">Select</option>
                      <option value="1">Inferior</option>
                      <option value="2">Decent</option>
                      <option value="3">Great</option>
                      <option value="4">Excellent</option>
                      <option value="5">Exceptional</option>
                    </select>
                  </div>
                  <div className="my-4">
                    <label htmlFor="comment" className="block text-lg mb-2">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring focus:ring-pink-200 focus:outline-none"></textarea>
                  </div>
                  <button type="submit" disabled={loadingProductReview} className={`w-full py-2 px-4 rounded-lg ${loadingProductReview ? "bg-gray-400" : "bg-pink-600 hover:bg-pink-700"} text-white`}>
                    {loadingProductReview ? "Submitting..." : "Submit"}
                  </button>
                </form>
              ) : (
                <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
                  <BiSolidMessageAltError size={50} className="w-fit mx-auto mb-4 text-red-500" />
                  <p className="text-center font-semibold text-gray-800">You cannot review this product unless you have purchased it.</p>
                  <p className="text-center text-gray-600 mt-2">
                    Browse our{" "}
                    <Link to="/shop" className="text-pink-600 font-bold hover:underline">
                      shop
                    </Link>{" "}
                    for more products!
                  </p>
                </div>
              )
            ) : (
              <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
                <BiSolidMessageAltError size={50} className="w-fit mx-auto mb-4 text-red-500" />
                <p className="text-center font-semibold text-gray-800">
                  Please{" "}
                  <Link to="/login" className="text-lg font-bold text-pink-600 hover:underline">
                    sign in
                  </Link>{" "}
                  to write a review.
                </p>
              </div>
            )}
          </div>
        )}

        {/* All Reviews Tab */}
        {activeTab === 1 && (
          <div className="mt-4">
            {product.reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 bg-gray-100 shadow-lg rounded-lg">
                <p className="text-gray-500 text-lg">No reviews yet.</p>
                <p className="text-gray-400">Be the first to write a review!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {product.reviews.map((review) => (
                  <div key={review._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                      <strong className="text-gray-700">{review.name}</strong>
                      <span className="text-gray-500 text-sm">{review.createdAt.substring(0, 10)}</span>
                    </div>
                    <p className="my-2 text-gray-800">{review.comment}</p>
                    <Ratings value={review.rating} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
