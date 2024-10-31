import React, { useState } from 'react';
import { db, storage } from '../firebase'; // Adjust the path based on your project structure
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Submission8 = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [institute, setInstitute] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleClassChange = (event) => {
    setClassName(event.target.value);
  };

  const handleInstituteChange = (event) => {
    setInstitute(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploadMessage('');
    setLoading(true);

    if (!file || !name || !className || !institute) {
      setUploadMessage('Please fill in all fields and select a file.');
      setLoading(false);
      return;
    }

    try {
      const fileType = file.type.startsWith("image/") ? "images" : "pdfs";
      const storageRef = ref(storage, `studenthomework8/${fileType}/${file.name}`);
      await uploadBytes(storageRef, file);

      const fileURL = await getDownloadURL(storageRef);

      // Save to Firestore
      await addDoc(collection(db, 'studenthomework8'), {
        name,
        fileURL,
        className,
        institute,
        fileType,
        submittedAt: new Date(),
      });

      setUploadMessage('File uploaded successfully!');
      setFile(null);
      setName('');
      setClassName('');
      setInstitute('');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadMessage('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Submit Your Homework - Grade 8</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enter Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enter Your Grade
          </label>
          <input
            type="text"
            value={className}
            onChange={handleClassChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enter Your Institute
          </label>
          <input
            type="text"
            value={institute}
            onChange={handleInstituteChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Your Homework (PDF or Image)
          </label>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
      {uploadMessage && (
        <div className="mt-4 text-center text-lg">
          {uploadMessage}
        </div>
      )}
    </div>
  );
};

export default Submission8;
