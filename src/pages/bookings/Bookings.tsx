const Bookings = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 mb-4">
              <svg
                className="w-12 h-12 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ color: '#6366F1' }}>
            Bookings
          </h1>
          <p className="text-xl text-gray-600 mb-2" style={{ color: '#475569' }}>
            Coming Soon
          </p>
          <p className="text-sm text-gray-500 max-w-md mx-auto" style={{ color: '#94A3B8' }}>
            We're working on bringing you an amazing booking experience. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
