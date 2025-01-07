const CategoryForm = ({name, setName, parentCategory, setParentCategory, isLoading, handleSubmit, categories, buttonText = "Submit", handleDelete}) => {
  return (
    <div className="p-3 ">
      <form onSubmit={handleSubmit}>
        <input className="p-3 bg-slate-100 rounded-lg border-2 w-full" type="text" placeholder="Create category" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="">
          <label className="block font-semibold p-3">Parent Category (Optional)</label>
          <select value={parentCategory} onChange={(e) => setParentCategory(e.target.value)} className="border-2 bg-slate-100 rounded-lg p-3 w-full">
            <option value="">None (Head Category)</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div
          className="flex mt-5
         justify-between">
          <button disabled={isLoading} type="submit" className="border-2 border-black rounded-lg font-medium hover:font-semibold  hover:bg-violet-600 bg-violet-500 text-white px-4 py-2">
            {buttonText}
          </button>
          {handleDelete && (
            <button disabled={isLoading} onClick={handleDelete} className=" border-2 border-black rounded-lg  px-4 py-2 text-white bg-red-500 font-medium   hover:bg-red-600 hover:font-semibold  ">
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
