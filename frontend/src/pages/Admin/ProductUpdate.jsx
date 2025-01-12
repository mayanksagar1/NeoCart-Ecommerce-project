import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useUpdateProductMutation, useGetProductByIdQuery, useDeleteProductMutation, useUploadImagesMutation} from "../../redux/api/productsApiSlice";
import {useFetchCategoriesQuery} from "../../redux/api/categoryApiSlice";
import {toast} from "react-toastify";
import AdminMenu from "./AdminMenu";
import BtnLoader from "../../components/BtnLoader";
import Loader from "../../components/Loader";
import {MdDeleteOutline, MdUpload} from "react-icons/md";

const ProductUpdate = () => {
  const params = useParams();

  const {data: productData, isLoading: fetchingProductData} = useGetProductByIdQuery(params._id);

  const [existingImages, setExistingImages] = useState(productData?.images || []);
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [countInStock, setCountInStock] = useState(productData?.countInStock || "");
  const [newlyUploadedImg, setNewlyUploadedImg] = useState([]);

  const navigate = useNavigate();

  const {data: categories, isLoading: fetchingCategoryData} = useFetchCategoriesQuery();

  const [updateProduct, {isLoading: isUpdating}] = useUpdateProductMutation();

  const [deleteProduct, {isLoading: isDeleting}] = useDeleteProductMutation();

  const [uploadImages, {isLoading: isUploading}] = useUploadImagesMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setExistingImages(productData.images);
      setCountInStock(productData.countInStock);
    }
  }, [productData]);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewlyUploadedImg(files);
  };

  const handleDeleteImage = (index, isExisting) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewlyUploadedImg((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = async () => {
    try {
      const imageData = new FormData();
      newlyUploadedImg.forEach((image) => imageData.append("images", image));
      const res = await uploadImages(imageData).unwrap();
      return res.urls;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !brand || !description || !category || !price || !quantity || !countInStock) {
      return toast.error("Please fill all the inputs");
    }
    if (existingImages.length === 0 && newlyUploadedImg.length === 0) {
      return toast.error("Please upload images");
    }

    try {
      const newUrls = await handleImageUpload();
      const images = [...existingImages, ...newUrls];
      const productData = {
        name,
        brand,
        category,
        price,
        quantity,
        countInStock,
        description,
        images,
      };

      const {data} = await updateProduct({productId: params._id, data: productData});

      if (data?.error) {
        toast.error("Failed to update product. Try Again!");
      } else {
        navigate("/admin/products/list");
        toast.success("Product updates successfully!!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload product. Try Again!");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const {data} = await deleteProduct(params._id);

      if (data?.error) {
        toast.error("Failed to delete the product. Try Again!!");
      } else {
        navigate("/admin/products/list");
        toast.success("Product deleted successfully!!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete the product. Try Again!!");
    }
  };

  if (fetchingProductData || fetchingCategoryData) {
    return <Loader />;
  }
  return (
    <section className="relative p-6 bg-gray-100 min-h-screen">
      <AdminMenu />
      <div className="max-w-5xl mx-auto mt-10 bg-white rounded-lg shadow-lg p-3 md:p-6">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6 ">Update Product</h1>
        <div className="rounded-lg">
          {/* Display existing images */}
          {existingImages.length > 0 && (
            <div className="p-3 md:p-6 flex flex-wrap gap-4">
              {existingImages.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt="Existing" className="w-24 h-24 object-cover rounded-lg border" />
                  <button className="absolute top-1 right-1 bg-red-500 text-white rounded-full py-1 px-2" onClick={() => handleDeleteImage(index, true)}>
                    <MdDeleteOutline size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Display new image previews */}
          {newlyUploadedImg.length > 0 && (
            <div className="p-3 md:p-6 flex flex-wrap gap-4">
              {newlyUploadedImg.map((img, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(img)} alt="New Preview" className="w-24 h-24 object-cover rounded-lg border" />
                  <button className="absolute top-1 right-1 bg-red-500 text-white rounded-full py-1 px-2" onClick={() => handleDeleteImage(index, false)}>
                    <MdDeleteOutline size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="p-3 md:p-6">
            <div className="flex flex-col gap-4 mb-4">
              <label className="block cursor-pointer bg-gray-200 py-3 px-4 text-center font-semibold text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-300">
                {"Upload Images"}
                <input type="file" name="image" accept="image/*" onChange={handleImagesChange} multiple className="hidden" />
              </label>
            </div>
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="">
                  <label htmlFor="name" className="block font-semibold text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500 "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="">
                  <label htmlFor="name" className="block font-semibold text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500 "
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="">
                  <label htmlFor="name" className="block font-semibold text-gray-700">
                    Brand
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500 "
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="">
                  <label htmlFor="name" className="block font-semibold text-gray-700">
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
            </div>
            <div className="my-4">
              <label htmlFor="" className="block font-semibold text-gray-700">
                Description
              </label>
              <textarea
                type="text"
                spellCheck
                className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="">
                  <label htmlFor="name" className="block font-semibold text-gray-700">
                    Category
                  </label>
                  <select
                    placeholder="Choose Category"
                    className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className=" ">
                  <label htmlFor="name" className="block font-semibold text-gray-700">
                    Count in Stock
                  </label>
                  <input
                    type="number"
                    className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500 "
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="p-3 flex justify-between items-center">
              <button
                disabled={isUpdating || isDeleting || isUploading}
                onClick={handleSubmit}
                className="py-2 px-4 md:py-3 md:px-6 flex gap-1 items-center rounded-lg text-lg  text-white font-bold bg-violet-500 hover:bg-violet-700">
                {isUpdating || isUploading ? (
                  <BtnLoader />
                ) : (
                  <>
                    <MdUpload size={24} />
                    <span>Update</span>
                  </>
                )}
              </button>
              <button
                disabled={isUpdating || isDeleting || isUploading}
                onClick={handleDelete}
                className="py-2 px-4 md:py-3 md:px-6 flex gap-1 items-center rounded-lg text-lg text-white font-bold bg-red-500 hover:bg-red-700">
                {isDeleting ? (
                  <BtnLoader />
                ) : (
                  <>
                    <MdDeleteOutline size={24} />
                    <span>Delete</span>
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

export default ProductUpdate;
