import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setCredentials} from "../../redux/features/auth/authSlice";
import {useProfileMutation} from "../../redux/api/usersApiSlice";
import Loader from "../../components/Loader";
import {toast} from "react-toastify";
import {MdEditSquare, MdUpload} from "react-icons/md";

const Profile = () => {
  const [edit, setEdit] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const {userInfo} = useSelector((state) => state.auth);

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.username, userInfo.email]);

  const [updateUserProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateUserProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({...res}));
        toast.success("Profile updated successfully");
        setEdit(true);
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        <button className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-md" onClick={() => setEdit(!edit)}>
          <MdEditSquare size={22} />
          <span>Edit</span>
        </button>
      </div>
      <form onSubmit={submitHandler} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="username" className="block text-gray-600 mb-2">
            Name
          </label>
          <input
            disabled={edit}
            id="username"
            type="text"
            placeholder="Enter name"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${edit ? "bg-gray-100 cursor-not-allowed" : "focus:ring-indigo-500"}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-gray-600 mb-2">
            Email Address
          </label>
          <input
            disabled={edit}
            id="email"
            type="email"
            placeholder="Enter email"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${edit ? "bg-gray-100 cursor-not-allowed" : "focus:ring-indigo-500"}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-gray-600 mb-2">
            Password
          </label>
          <input
            disabled={edit}
            id="password"
            type="password"
            placeholder="Enter password"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${edit ? "bg-gray-100 cursor-not-allowed" : "focus:ring-indigo-500"}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-600 mb-2">
            Confirm Password
          </label>
          <input
            disabled={edit}
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${edit ? "bg-gray-100 cursor-not-allowed" : "focus:ring-indigo-500"}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button disabled={loadingUpdateProfile || edit} type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-lg">
            <MdUpload size={20} />
            <span>Update</span>
          </button>
        </div>
        {loadingUpdateProfile && <Loader />}
      </form>
    </div>
  );
};

export default Profile;
