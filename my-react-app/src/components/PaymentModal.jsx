import React from 'react';

// Use the specific UPI ID provided by the user
const FREELANCER_UPI_VPA = '6385330466@upi'; 
const UPI_QR_CODE_PATH = '/upiqr.jpg'; // Assuming 'upiqr.png' is in your public folder

const PaymentModal = ({ gig, onClose }) => {
  
  // Construct the UPI Deep Link content
  const upiLink = `upi://pay?pa=${FREELANCER_UPI_VPA}&pn=${encodeURIComponent(gig.freelancerId.username)}&mc=0000&tid=TXN${Date.now()}&am=${gig.price}&cu=INR&tn=${encodeURIComponent('GigHub Order: ' + gig.title)}`;
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative p-8 border w-96 shadow-2xl rounded-xl bg-white transform transition-all" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-center text-teal-600">Payment Details</h3>
        <p className="mt-2 text-center text-gray-700">Please complete the UPI payment for your order.</p>
        
        <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-medium text-gray-500">Order: <span className="text-gray-800 font-semibold">{gig.title}</span></p>
          <p className="text-sm font-medium text-gray-500">Payee VPA: <span className="text-gray-800 font-semibold">{FREELANCER_UPI_VPA}</span></p>
          <p className="text-sm font-medium text-gray-500">Amount: <span className="text-2xl font-extrabold text-teal-600">${gig.price}</span></p>
        </div>

        <div className="mt-6 flex flex-col items-center">
          {/* Display the specified image */}
          <img 
            src={UPI_QR_CODE_PATH} // Use the provided path
            alt="UPI QR Code for Payment" 
            className="w-48 h-48 rounded-lg border-4 border-teal-500 mb-4"
          />
          
          <p className="text-xs text-gray-500 break-all mb-4 text-center">
             Scan this code or use the link: <a href={upiLink} className="text-teal-500 hover:underline">{upiLink.substring(0, 50)}...</a>
          </p>
        </div>

        {/* Kept only the Close button */}
        <button 
          onClick={onClose} 
          className="mt-4 w-full bg-gray-500 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;