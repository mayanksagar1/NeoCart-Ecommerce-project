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
    <section className="relative p-4">
      <AdminMenu />
      <h1 className="text-2xl md:pl-[10rem] mt-4 mb-4 text-center md:text-left font-bold ">Update Product</h1>
      <div className="m-auto rounded-lg border-2 bg-white w-fit">
        {/* Display existing images */}
        {existingImages.length > 0 && (
          <div className="p-6 flex flex-wrap gap-4">
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
          <div className="p-6 flex flex-wrap gap-4">
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
        <div className="p-3 w-[85vw]">
          <div className="m-3">
            <label className="border-2 bg-slate-100  px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-3">
              {"Upload Images"}
              <input type="file" name="image" accept="image/*" onChange={handleImagesChange} multiple className="hidden" />
            </label>
          </div>
          <div className="p-3">
            <div className="flex  gap-5">
              <div className="w-full">
                <label htmlFor="name" className="font-semibold text-lg">
                  Name
                </label>{" "}
                <br />
                <input type="text" className="p-3 bg-slate-100 mt-2 w-full border-2 rounded-lg " value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="w-full ">
                <label htmlFor="name" className="font-semibold text-lg">
                  Price
                </label>{" "}
                <br />
                <input type="number" className="p-3 bg-slate-100 mt-2 w-full  border-2 rounded-lg " value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="flex  gap-5">
              <div className="w-full">
                <label htmlFor="name" className="font-semibold text-lg">
                  Brand
                </label>{" "}
                <br />
                <input type="text" className="p-3 bg-slate-100 mt-2 w-full border-2 rounded-lg " value={brand} onChange={(e) => setBrand(e.target.value)} />
              </div>
              <div className="w-full ">
                <label htmlFor="name" className="font-semibold text-lg">
                  Quantity
                </label>{" "}
                <br />
                <input type="number" className="p-3 bg-slate-100 mt-2 w-full  border-2 rounded-lg " value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="p-3">
            <label htmlFor="" className="font-semibold text-lg">
              Description
            </label>
            <textarea type="text" spellCheck className="p-2 mt-2 bg-slate-100 border-2 rounded-lg w-full" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="p-3">
            <div className="flex  gap-5">
              <div className="w-full">
                <label htmlFor="name" className="font-semibold text-lg">
                  Category
                </label>
                <br />
                <select placeholder="Choose Category" className="p-3 border rounded-lg w-full bg-slate-100 mt-2" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full ">
                <label htmlFor="name" className="font-semibold text-lg">
                  Count in Stock
                </label>
                <br />
                <input type="number" className="p-3 bg-slate-100 mt-2 w-full  border-2 rounded-lg " value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="p-3 flex justify-between items-center">
            <button
              disabled={isUpdating || isDeleting || isUploading}
              onClick={handleSubmit}
              className="py-2 px-4 md:py-3 md:px-6 flex gap-1 items-center rounded-lg text-lg border-2 border-black text-white font-bold bg-violet-500 hover:bg-violet-700">
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
              className="py-2 px-4 md:py-3 md:px-6 flex gap-1 items-center rounded-lg text-lg border-2 border-black text-white font-bold bg-red-500 hover:bg-red-700">
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
    </section>
  );
};

export default ProductUpdate;
