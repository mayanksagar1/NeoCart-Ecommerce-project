import {useState, useEffect} from "react";
import {useFetchCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useGetCategoryByIdMutation} from "../../redux/api/categoryApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {toast} from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";

const CategoryList = () => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newParentCategory, setNewParentCategory] = useState("");

  const [editableCategoryName, setEditableCategoryName] = useState("");
  const [editableCategory, setEditableCategory] = useState(null);
  const [editableParentCategory, setEditableParentCategory] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {data: categories, isLoading, refetch, error} = useFetchCategoriesQuery();
  const [createCategory, {isLoading: creatingCategory}] = useCreateCategoryMutation();
  const [updateCategory, {isLoading: updatingCategory}] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const onModalClose = () => {
    setEditableCategory(null);
    setEditableCategoryName("");
    setEditableParentCategory("");
    setIsModalOpen(false);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editableCategoryName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const res = await updateCategory({id: editableCategory._id, data: {name: editableCategoryName, parentCategory: editableParentCategory || null}}).unwrap();
      if (res.error) {
        toast.error(`${res.error}`);
      }
      onModalClose();
      refetch();
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) {
      toast.error("Category name is required");
      return;
    }
    try {
      const res = await createCategory({name: newCategoryName, parentCategory: newParentCategory || null}).unwrap();
      if (res.error) {
        toast.error(`${res.error}`);
      }
      refetch();
      setNewCategoryName("");
      setNewParentCategory("");
      toast.success("Category created successfully");
    } catch (error) {
      toast.error("Failed to create category, Try Again.");
    }
  };

  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await deleteCategory(editableCategory._id).unwrap();
      console.log(res);
      if (res.error) {
        toast.error(res.error);
      }
      onModalClose();
      refetch();
      toast.success("Deleted Category successfully");
    } catch (error) {
      toast.error(error?.data?.error || error.message);
    }
  };

  return (
    <section className="p-4 relative">
      <h1 className="text-2xl md:pl-[10rem] mt-4 mb-4 text-center md:text-left font-bold ">Manage Categories</h1>
      <AdminMenu />
      <div className="m-auto rounded-lg border-2 bg-white w-fit">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">{error?.data?.message || error.message}</Message>
        ) : (
          <div className=" w-[85vw]">
            <CategoryForm
              name={newCategoryName}
              setName={setNewCategoryName}
              parentCategory={newParentCategory}
              setParentCategory={setNewParentCategory}
              isLoading={creatingCategory}
              handleSubmit={handleCreateCategory}
              categories={categories}
            />
            <hr />
            <div className="flex p-3 gap-4 flex-wrap">
              {categories?.map((category) => (
                <button
                  className="px-4 py-2 rounded-xl text-violet-500 bg-white border-violet-500 border-2 font-medium text-lg hover:bg-violet-500 hover:text-white hover:font-semibold hover:border-black"
                  key={category._id}
                  onClick={() => {
                    setEditableCategory(category);
                    setEditableCategoryName(category.name);
                    setEditableParentCategory(category.parentCategory || "");
                    setIsModalOpen(true);
                  }}>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <div className="w-[60vw]">
          <CategoryForm
            setName={setEditableCategoryName}
            name={editableCategoryName}
            parentCategory={editableParentCategory}
            setParentCategory={setEditableParentCategory}
            categories={categories}
            isLoading={updatingCategory}
            buttonText="Update"
            handleSubmit={handleUpdateCategory}
            handleDelete={handleDeleteCategory}
          />
        </div>
      </Modal>
    </section>
  );
};

export default CategoryList;
