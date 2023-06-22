import { toast } from "react-toastify";

export const notifyError = (message) =>
  toast.error(message, {
    className: "flex justify-center items-center alert alert-error",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
export const notifyWarning = (message) =>
  toast.warning(message, {
    className: "flex justify-center items-center alert alert-warning",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export const notifySuccess = (message) =>
  toast.success(message, {
    className: "flex justify-center items-center alert alert-success",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
