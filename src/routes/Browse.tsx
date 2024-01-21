import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Browse() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/movies", { replace: true });
  }, [navigate]);

  return null;
}
