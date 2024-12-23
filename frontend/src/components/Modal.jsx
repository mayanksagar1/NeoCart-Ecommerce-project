import {FaTimes} from "react-icons/fa";

const Modal = ({isOpen, onClose, isLoading, children}) => {
  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-[50%]"></div>
          <div className="fixed inset-0  z-50">
            <div className="relative w-[100vw] h-[100vh] flex justify-center items-center">
              <div className="bg-white h-fit flex flex-col  z-10 p-4 rounded-lg">
                <button disabled={isLoading} className="self-end " onClick={onClose}>
                  <FaTimes size={20} />
                </button>
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
