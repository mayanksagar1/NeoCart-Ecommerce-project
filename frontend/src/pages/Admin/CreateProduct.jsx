import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAddProductMutation, useUploadImagesMutation} from "../../redux/api/productsApiSlice";
import {useFetchCategoriesQuery} from "../../redux/api/categoryApiSlice";
import {toast} from "react-toastify";
import AdminMenu from "./AdminMenu";
import BtnLoader from "../../components/BtnLoader";
import {MdUpload} from "react-icons/md";

const CreateProduct = () => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [countInStock, setCountInStock] = useState("");

  const navigate = useNavigate();

  const [createProduct, {isLoading}] = useAddProductMutation();
  const [uploadImages, {isLoading: uploadingImages}] = useUploadImagesMutation();
  const {data: categories} = useFetchCategoriesQuery();

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleImageUpload = async () => {
    const imageData = new FormData();
    images.forEach((image) => imageData.append("images", image));
    const res = await uploadImages(imageData).unwrap();
    return res.urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !brand || !price || !quantity || !description || !category || !countInStock || !images) {
      return toast.error("Please fill all the inputs");
    }

    try {
      const urls = await handleImageUpload();
      const productData = {
        name,
        brand,
        description,
        quantity,
        countInStock,
        price,
        category,
        images: urls,
      };

      const {data} = await createProduct(productData);

      if (data?.error) {
        toast.error("Product creation failed. Try Again!");
      }
      toast.success(`${data.name} is created.`);
    } catch (error) {
      console.log(error);
      toast.error("Product creation failed. Try Again!");
    }
  };

  return (
    <section className="relative p-6">
      <AdminMenu />
      <div className="max-w-5xl mx-auto mt-10 bg-white rounded-lg shadow-lg p-3 md:p-6">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Create Product</h1>
        <div className="rounded-lg">
          {images.length > 0 && (
            <div className="p-3 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <img key={index} src={URL.createObjectURL(img)} alt="Preview" className="w-full h-32 object-cover rounded-lg shadow-md" />
              ))}
            </div>
          )}
          <div className="p-3 md:p-6">
            <div className="flex flex-col gap-4 mb-4">
              <label className="block cursor-pointer bg-gray-200 py-3 px-4 text-center font-semibold text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-300">
                Upload Images
                <input type="file" name="image" accept="image/*" onChange={handleImagesChange} multiple className="hidden" />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block font-semibold text-gray-700">
                  Name
                </label>
                <input type="text" className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="price" className="block font-semibold text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="brand" className="block font-semibold text-gray-700">
                  Brand
                </label>
                <input
                  type="text"
                  className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block font-semibold text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>
            <div className="my-4">
              <label htmlFor="description" className="block font-semibold text-gray-700">
                Description
              </label>
              <textarea
                className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block font-semibold text-gray-700">
                  Category
                </label>
                <select className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500" onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="countInStock" className="block font-semibold text-gray-700">
                  Count in Stock
                </label>
                <input
                  type="number"
                  className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                disabled={isLoading || uploadingImages}
                onClick={handleSubmit}
                className="py-3 px-6 w-full md:w-auto rounded-lg flex justify-center items-center text-lg font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isLoading || uploadingImages ? (
                  <BtnLoader />
                ) : (
                  <>
                    <MdUpload size={24} className="mr-2" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateProduct;
