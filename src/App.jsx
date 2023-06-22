import { ToastContainer } from "react-toastify";
import { FpsView } from "react-fps";
import PoseDetection from "./detection";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <FpsView />
      <ToastContainer/>
      <div className="h-screen bg-slate-950">
        <PoseDetection />
      </div>
    </>
  );
}

export default App;
