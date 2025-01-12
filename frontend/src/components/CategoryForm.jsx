const CategoryForm = ({name, setName, parentCategory, setParentCategory, isLoading, handleSubmit, categories, buttonText = "Submit", handleDelete}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit}>
        <input
          className=" w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500"
          type="text"
          placeholder="Create category"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="mt-4">
          <label className="block font-semibold text-gray-700">Parent Category (Optional)</label>
          <select value={parentCategory} onChange={(e) => setParentCategory(e.target.value)} className="mt-2 w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-violet-500">
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
         justify-between gap-2">
          <button
            disabled={isLoading}
            type="submit"
            className="py-3 px-6 w-full md:w-auto rounded-lg flex justify-center items-center text-lg font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {buttonText}
          </button>
          {handleDelete && (
            <button
              disabled={isLoading}
              onClick={handleDelete}
              className=" py-3 px-6 w-full md:w-auto rounded-lg flex justify-center items-center text-lg font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed  ">
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
