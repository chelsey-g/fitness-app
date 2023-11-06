import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const WeightInputForm = () => {
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [weight, setWeight] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  );

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { data, error } = await supabase
      .from('weight-tracker')
      .insert([
        {
          date,
          weight,
        },
      ]);

    if (error) {
      console.error('Error inserting data into Supabase:', error);
    } else {
      console.log('Data inserted successfully:', data);
      setSubmittedData(data);
      setIsSubmitted(true);
      router.push('/tracker/chart');
    }
  };

  const handleChartButton = () => {
    router.push('/tracker/chart');
  };

  return (
    <div className="container mx-auto p-4">
      {!isSubmitted && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-800 opacity-50"></div>

          <div className="bg-white rounded-lg p-4 shadow-md z-10">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-600">
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="weight" className="block text-gray-600">
                  Weight:
                </label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full focus:outline-none"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 ml-5 hover:bg-purple-600 text-white py-2 px-4 rounded-full focus:outline-none"
                  onClick={handleChartButton}
                >
                  See Chart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightInputForm;
