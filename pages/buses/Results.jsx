import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BusSearch from "../../src/components/buses/BusSearch";
import BusSeatSelection from "../../src/components/buses/BusSeatSelection";

const BusResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  // BusSearch se: buses = data?.data?.results?.results ?? []
  const { buses = [], fromCity, toCity, date } = state;

  useEffect(() => {
    if (!location.state) {
      navigate("/buses", { replace: true });
    }
  }, []);

  if (!location.state) return null;

  const journeyDate = date ? new Date(date) : null;

  return (
    <>  
      <BusSearch
        initialFrom={fromCity}
        initialTo={toCity}
        initialDate={journeyDate}
      />
      <BusSeatSelection
        buses={Array.isArray(buses) ? buses : []}
        from={fromCity?.name || ""}
        to={toCity?.name || ""}
      />
    </>
  );
};

export default BusResultsPage;
