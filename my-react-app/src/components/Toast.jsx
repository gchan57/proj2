import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const Toast = ({ message, type }) => {
  const isSuccess = type === 'success';
  return (
    <div className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg text-white ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}>
      {isSuccess ? (
        <CheckCircleIcon className="h-6 w-6 mr-2" />
      ) : (
        <XCircleIcon className="h-6 w-6 mr-2" />
      )}
      <span>{message}</span>
    </div>
  );
};

export default Toast;