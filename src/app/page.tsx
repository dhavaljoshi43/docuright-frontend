// src/app/page.tsx
'use client'; // This is a Client Component, which allows for interactivity and state.

import { useState } from 'react';
import { generatePdf } from '@/lib/api'; // Using the import alias '@'

// Define the structure of our form data with an interface
interface NdaFormData {
  effectiveDate: string;
  agreementCity: string;
  agreementState: string;
  firstPartyName: string;
  secondPartyName: string;
  purposeOfNDA: string;
  firstPartyRepresentativeName: string;
  firstPartyAddress: string;
  secondPartyRepresentativeName: string;
  secondPartyAddress: string;
}

export default function Home() {
  // State to hold all the form data
  const [formData, setFormData] = useState<NdaFormData>({
    effectiveDate: '',
    agreementCity: '',
    agreementState: '',
    firstPartyName: '',
    secondPartyName: '',
    purposeOfNDA: '',
    firstPartyRepresentativeName: '',
    firstPartyAddress: '',
    secondPartyRepresentativeName: '',
    secondPartyAddress: '',
  });
  
  // State to manage loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A single handler to update the form data state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // The function to run when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default browser form submission
    setIsLoading(true);
    setError(null);

    try {
      const blob = await generatePdf('nda', formData);

      // Create a URL for the returned PDF blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'NDA_Document.pdf'; // Filename for the downloaded file
      document.body.appendChild(a);
      a.click();
      
      // Clean up the temporary URL and link
      window.URL.revokeObjectURL(url);
      a.remove();

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">NDA Generator</h1>
        <p className="text-gray-600 mb-6 text-center">Fill in the details below to generate your Non-Disclosure Agreement.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* We map over an array to create the form fields dynamically */}
          {[
            { label: 'Effective Date', name: 'effectiveDate', type: 'date' },
            { label: 'Agreement City', name: 'agreementCity' },
            { label: 'Agreement State', name: 'agreementState' },
            { label: 'First Party Name', name: 'firstPartyName' },
            { label: 'First Party Representative', name: 'firstPartyRepresentativeName' },
            { label: 'First Party Address', name: 'firstPartyAddress' },
            { label: 'Second Party Name', name: 'secondPartyName' },
            { label: 'Second Party Representative', name: 'secondPartyRepresentativeName' },
            { label: 'Second Party Address', name: 'secondPartyAddress' },
            { label: 'Purpose of NDA', name: 'purposeOfNDA' },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type || 'text'}
                id={field.name}
                name={field.name}
                value={formData[field.name as keyof NdaFormData]}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          ))}

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isLoading ? 'Generating...' : 'Generate and Download PDF'}
          </button>
        </form>
      </div>
    </main>
  );
}
