// pages/buses/BusPassengerPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PassengerDetailsForm from "../../src/components/buses/PassangersDetailsForm";

const BusPassengerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  useEffect(() => {
    if (!location.state) navigate("/buses", { replace: true });
  }, []);

  if (!location.state) return null;

  const { bus, selectedSeatObjects, selectedSeatNames, selectedBoardingPoint, selectedDroppingPoint } = state;

  return (
    <PassengerDetailsForm
      bus={bus}
      selectedSeatObjects={selectedSeatObjects}
      selectedSeatNames={selectedSeatNames}
      selectedBoardingPoint={selectedBoardingPoint}
      selectedDroppingPoint={selectedDroppingPoint}
    />
  );
};

export default BusPassengerPage;