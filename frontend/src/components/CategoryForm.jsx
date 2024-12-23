const CategoryForm = ({value, setValue, isLoading, handleSubmit, buttonText = "Submit", handleDelete}) => {
  return (
    <div className="p-3 ">
      <form onSubmit={handleSubmit}>
        <input className="p-3 bg-slate-100 rounded-lg border-2 w-full" type="text" placeholder="Create category" value={value} onChange={(e) => setValue(e.target.value)} />
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
