import React from "react";
import axios from "axios";

const PayPortal = () => {
    // const handlePayNow = async () => {
    //   try {
    //     const res = await axios.post('http://localhost:5001/create-payment-link', {
    //       upiId,
    //       amount,
    //       name,
    //       email,
    //       interviewId,
    //     });
  
    //     if (res.data.short_url) {
    //       window.open(res.data.short_url, '_blank');
    //     }
    //   } catch (err) {
    //     console.error('Error:', err);
    //   }
    // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md text-center w-80">
        <h1 className="text-xl font-bold mb-4">Pay Interviewer</h1>
        {/* <div className="mb-2">
          <strong>Payee:</strong> {name}
        </div>
        <div className="mb-2">
          <strong>UPI ID:</strong> {upiId}
        </div>
        <div className="mb-4">
          <strong>Amount:</strong> ₹{amount}
        </div> */}
        {/* <button
          onClick={handlePayNow}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Pay Now via UPI
        </button> */}
      </div>
    </div>
  );
};

export default PayPortal;
