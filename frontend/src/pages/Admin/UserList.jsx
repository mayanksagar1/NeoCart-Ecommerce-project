import {useEffect, useState} from "react";
import {FaTrash, FaEdit, FaCheck, FaTimes} from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation} from "../../redux/api/usersApiSlice";
import {toast} from "react-toastify";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const {data: users, refetch, isLoading, error} = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <section className="p-4 relative">
      <h1 className="text-2xl pl-[10rem] font-semibold mb-4">Users</h1>
      <AdminMenu />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error?.data?.message || error.message}</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full md:w-4/5 mx-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-[#642bd6] text-white">
                <th scope="col" className="px-4 py-2 text-left border-b border-gray-300">
                  ID
                </th>
                <th scope="col" className="px-4 py-2 text-left border-b border-gray-300">
                  NAME
                </th>
                <th scope="col" className="px-4 py-2 text-left border-b border-gray-300">
                  EMAIL
                </th>
                <th scope="col" className="px-4 py-2 text-left border-b border-gray-300">
                  ADMIN
                </th>
                <th scope="col" className="px-4 py-2 border-b border-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className={` odd:bg-gray-100 even:bg-gray-300 hover:bg-gray-400`}>
                  <td className="px-4 py-2 w-[5%] overflow-clip border-b border-gray-300">{user._id}</td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {editableUserId === user._id ? (
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={editableUserName}
                          onChange={(e) => setEditableUserName(e.target.value)}
                          className="w-[10rem] lg:w-full p-2 border rounded-lg"
                          aria-label="Edit user name"
                        />
                        <button onClick={() => updateHandler(user._id)} className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg" aria-label="Confirm name changes">
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        {user.username}
                        <button onClick={() => toggleEdit(user._id, user.username, user.email)} aria-label="Edit user" className="ml-2 text-blue-500">
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {editableUserId === user._id ? (
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={editableUserEmail}
                          onChange={(e) => setEditableUserEmail(e.target.value)}
                          className="w-[10rem] lg:w-full p-2 border rounded-lg"
                          aria-label="Edit user email"
                        />
                        <button onClick={() => updateHandler(user._id)} className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg" aria-label="Confirm email changes">
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <a href={`mailto:${user.email}`} className="text-blue-500 underline">
                          {user.email}
                        </a>
                        <button onClick={() => toggleEdit(user._id, user.name, user.email)} aria-label="Edit user email" className="ml-2 text-blue-500">
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">{user.role === "admin" ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}</td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {user.role !== "admin" && (
                      <button onClick={() => deleteHandler(user._id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" aria-label="Delete user">
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default UserList;
