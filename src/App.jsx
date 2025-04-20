import React from 'react';
import { ErrorBoundary, displayGlobalError, handleApiError, triggerSyntaxError } from './ErrorHandler';

const ExampleComponent = () => {
  const [data, setData] = React.useState(null);
  const [postId, setPostId] = React.useState("");


  const fetchPostById = async () => {
    if (!postId) {
      displayGlobalError("Post ID cannot be empty.");
      return;
    }

    if (isNaN(postId)) {
      displayGlobalError("Post ID must be a number");
      return;
    }
    
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      if (!response.ok) {
        throw new Error(`Post not found (Status ${response.status})`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      displayGlobalError(handleApiError(err).message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-3xl mx-auto mt-36">


      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
    
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
          placeholder="Enter Post ID (1-100)"
          className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={fetchPostById}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
        >
          Fetch Post
        </button>
      </div>

      {data && (
        <div className="bg-sky-50 border border-sky-200 p-5 mt-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-sky-800">✅ Fetched Result:</h3>
          <pre className="text-slate-700 text-sm mt-3 bg-sky-100 p-3 rounded overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ExampleComponent;
