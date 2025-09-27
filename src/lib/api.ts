// src/lib/api.ts

/**
 * Calls the backend API to generate a PDF document.
 * @param documentType - The type of document to generate (e.g., 'nda').
 * @param data - The form data to be sent to the backend.
 * @returns A promise that resolves to a Blob (the PDF file).
 */
export const generatePdf = async (documentType: string, data: any): Promise<Blob> => {
  // IMPORTANT: Make sure your Spring Boot API URL is correct.
  // We will store this in an environment variable later.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const response = await fetch(`${apiUrl}/api/${documentType}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    // If the server returns an error, we throw an error to be caught by the form handler.
    const errorData = await response.text();
    console.error("API Error:", errorData);
    throw new Error('Failed to generate PDF. Check the console for details.');
  }

  // The backend returns the PDF file as a blob.
  return response.blob();
};

// Add this new function for AI preview
export const previewAIContent = async (data: any): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const response = await fetch(`${apiUrl}/api/nda/preview-ai-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to preview AI content');
  }

  return response.json();
};
