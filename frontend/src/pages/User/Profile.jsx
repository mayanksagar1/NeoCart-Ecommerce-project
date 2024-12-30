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
        console.log(res);
        dispatch(setCredentials({...res}));
        toast.success("Profile updated successfully");
        setEdit(true);
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message || err.message);
      }
    }
  };
  return (
    <div className="p-4 bg-white mb-5 rounded-lg md:w-[90%] w-[100%] border-2 shadow-md">
      <h2 className="flex items-center p-3 justify-between font-semibold gap-3">
        Profile
        <button className="border-black border-2 flex items-center gap-2 rounded bg-violet-500 hover:bg-violet-500 p-2 text-white" onClick={() => setEdit(false)}>
          <MdEditSquare size={22} />
          Edit
        </button>
      </h2>
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">
            Name
          </label>
          <input disabled={edit} id="username" type="text" placeholder="Enter name" className="form-input p-4 rounded-lg w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email Address
          </label>
          <input disabled={edit} id="email" type="email" placeholder="Enter email" className="form-input p-4 rounded-lg w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block  mb-2">
            Password
          </label>
          <input
            disabled={edit}
            id="password"
            type="password"
            placeholder="Enter password"
            className="form-input p-4 rounded-lg w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-2">
            Confirm Password
          </label>
          <input
            disabled={edit}
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            className="form-input p-4 rounded-lg w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <button disabled={edit} type="submit" className="flex items-center gap-1 border-black border-2 bg-violet-500 text-white py-2 px-4 rounded hover:bg-violet-600">
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
