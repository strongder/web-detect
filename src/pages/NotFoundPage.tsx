import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const handleGoHome = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/");
    } else if (role === "user") {
      navigate("/user/");
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      <div className="text-8xl font-extrabold mb-4 drop-shadow-lg">404</div>
      <div className="text-2xl font-semibold mb-2">Không tìm thấy trang</div>
      <div className="mb-8 text-gray-300">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </div>
      <Button
        onClick={handleGoHome}
        className="px-8 py-3 text-lg rounded-full bg-white text-gray-900 font-bold shadow-lg hover:bg-gray-200 transition"
      >
        Quay về trang chủ
      </Button>
    </div>
  );
}
