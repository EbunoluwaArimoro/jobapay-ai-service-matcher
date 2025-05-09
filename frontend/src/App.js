import React from "react";
import { Routes, Route } from "react-router-dom";
import ReviewThanks from "./components/ReviewThanks";

import Home from "./pages/Home";
import BookingForm from "./components/BookingForm";
import Confirmation from "./components/Confirmation";
import LeaveReview from "./components/LeaveReview";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:providerId" element={<BookingForm />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/review" element={<LeaveReview />} />
      <Route path="/review/thanks" element={<ReviewThanks />} />
    </Routes>
  );
}

export default App;
