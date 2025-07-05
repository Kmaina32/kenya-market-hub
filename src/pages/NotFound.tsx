
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Ghost, ArrowLeftCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center text-center border border-orange-200 animate-bounce-in">
        <div className="mx-auto mb-4 animate-pulse-glow">
          <Ghost className="h-16 w-16 text-orange-400" />
        </div>
        <h1 className="text-5xl font-black text-red-600 mb-2 tracking-tight gradient-text" style={{ lineHeight: 1 }}>
          404
        </h1>
        <p className="text-lg text-gray-800 mb-2 font-semibold">
          Oops! This page has vanished into thin air.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          The page you&apos;re looking for doesn&apos;t exist, moved, or is temporarily unavailable.<br />
          Let&apos;s get you back to browsing Sokko Sasa!
        </p>
        <Button
          size="lg"
          className="mt-4 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg hover-scale"
          onClick={() => navigate("/")}
        >
          <ArrowLeftCircle className="h-5 w-5" />
          Back to Home
        </Button>
        <div className="mt-8 text-xs text-gray-400">
          Error Code: 404<br />
          <span className="font-mono break-all">{location.pathname}</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

