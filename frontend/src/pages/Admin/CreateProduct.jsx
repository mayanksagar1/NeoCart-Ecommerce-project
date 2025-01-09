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
    <section className="relative p-4">
      <AdminMenu />
      <h1 className="text-2xl md:pl-[10rem] mt-4 mb-4 text-center md:text-left font-bold ">Create Product</h1>
      <div className="m-auto rounded-lg border-2 bg-white w-fit">
        {images.length > 0 && (
          <div className="p-6 flex flex-wrap gap-4">
            {images.map((img, index) => (
              <img key={index} src={URL.createObjectURL(img)} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
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
                </label>{" "}
                <br />
                <select placeholder="Choose Category" className="p-3 border rounded-lg w-full bg-slate-100 mt-2" onChange={(e) => setCategory(e.target.value)}>
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
          <div className="mt-3 m-auto w-fit">
            <button
              disabled={isLoading || uploadingImages}
              onClick={handleSubmit}
              className="py-3 px-6 rounded-lg flex gap-1 items-center text-lg border-2 border-black text-white font-bold bg-violet-500 hover:bg-violet-700">
              {isLoading || uploadingImages ? (
                <BtnLoader />
              ) : (
                <>
                  <MdUpload size={24} />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateProduct;
