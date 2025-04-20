import React, { useState, useEffect } from 'react';

export const setupGlobalErrorHandler = () => {
  const originalConsoleError = console.error;
  const originalWindowOnError = window.onerror;

  console.error = function(...args) {
    const errorString = args.join(' ');
    if (errorString.includes('SyntaxError') || errorString.includes('fatal')) {
      displayGlobalError(errorString);
    }
    originalConsoleError.apply(console, args);
  };
  
  window.onerror = function(message, source, lineno, colno, error) {
    displayGlobalError(`${message}\nAt: ${source}:${lineno}:${colno}`);
    if (originalWindowOnError) {
      return originalWindowOnError(message, source, lineno, colno, error);
    }
    return false;
  };
  
  window.addEventListener('unhandledrejection', function(event) {
    displayGlobalError(`Unhandled Promise Rejection: ${event.reason}`);
  });

  window.addEventListener('error', function(event) {
    displayGlobalError(`${event.message}\nAt: ${event.filename}:${event.lineno}:${event.colno}`);
    event.preventDefault();
  });
};

export const displayGlobalError = (errorMessage) => {
  let errorOverlay = document.getElementById('global-error-overlay');

  if (!errorOverlay) {
    errorOverlay = document.createElement('div');
    errorOverlay.id = 'global-error-overlay';
    Object.assign(errorOverlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      color: '#F8FAFC',
      padding: '40px 20px',
      boxSizing: 'border-box',
      zIndex: '10000',
      overflowY: 'auto',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    });

    const header = document.createElement('h2');
    header.textContent = 'Error Detected';
    Object.assign(header.style, {
      fontSize: '32px',
      fontWeight: '800',
      marginBottom: '16px',
    });

    const errorContainer = document.createElement('pre');
    Object.assign(errorContainer.style, {
      whiteSpace: 'pre-wrap',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      textAlign: 'left',
      maxWidth: '800px',
      overflowX: 'auto',
      marginBottom: '24px',
      fontSize: '14px',
      lineHeight: '1.6',
    });
    errorContainer.textContent = errorMessage;

    const reloadButton = document.createElement('button');
    reloadButton.textContent = '🔄 Reload App';
    Object.assign(reloadButton.style, {
      padding: '12px 24px',
      backgroundColor: '#F43F5E',
      color: 'white',
      border: 'none',
      borderRadius: '9999px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    });
    reloadButton.onmouseenter = () => {
      reloadButton.style.backgroundColor = '#BE123C';
    };
    reloadButton.onmouseleave = () => {
      reloadButton.style.backgroundColor = '#F43F5E';
    };
    reloadButton.onclick = () => window.location.reload();

    errorOverlay.appendChild(header);
    errorOverlay.appendChild(errorContainer);
    errorOverlay.appendChild(reloadButton);

    document.body.appendChild(errorOverlay);
  } else {
    const errorContainer = errorOverlay.querySelector('pre');
    if (errorContainer) {
      errorContainer.textContent = errorMessage;
    }
    errorOverlay.style.display = 'flex';
  }
};

// Function component version of ErrorBoundary for React 19
function ErrorBoundary({ children }) {
  const [errorState, setErrorState] = useState({
    hasError: false,
    error: null
  });

  useEffect(() => {
    // Function to handle errors
    const handleError = (error) => {
      setErrorState({
        hasError: true,
        error: error instanceof Error ? error : new Error(String(error))
      });
      // Log the error for debugging
      console.error("Error caught by React ErrorBoundary:", error);
    };

    // Create custom error event for React errors
    const errorListener = (event) => {
      if (event.detail && event.detail.isReactError) {
        handleError(event.detail.error);
        event.preventDefault();
      }
    };

    // Register event listener
    window.addEventListener('error', errorListener);
    
    // Use React's error event system (for React 19 compatibility)
    window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ = {
      handleRuntimeError: handleError
    };

    // Cleanup
    return () => {
      window.removeEventListener('error', errorListener);
      delete window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__;
    };
  }, []);
  
  // Error boundary specific to React components
  const ErrorFallback = () => {
    if (!errorState.hasError) return null;
    
    return (
      <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg shadow-lg max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Got an Error!</h2>
        <p className="mb-4">{errorState.error && errorState.error.message}</p>
        <button 
          onClick={() => setErrorState({ hasError: false, error: null })} 
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
        >
          🔄 Try Again
        </button>
      </div>
    );
  };

  if (errorState.hasError) {
    return <ErrorFallback />;
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}

const useErrorHandler = () => {
  const [error, setError] = useState(null);
  
  const ErrorComponent = () => {
    if (!error) return null;
    
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
        <div className="flex">
          <div className="py-1">
            <svg className="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">API Error</p>
            <p className="text-sm">{error.message || 'Something went wrong'}</p>
            <button 
              onClick={() => setError(null)} 
              className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return {
    error,
    setError,
    ErrorComponent
  };
};

const handleApiError = (error) => {
  let errorMessage = "An unexpected error occurred";
  
  if (error.response) {
    errorMessage = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
  } else if (error.request) {
    errorMessage = "Network error - no response from server";
  } else {
    errorMessage = error.message || "Unknown error";
  }
  
  return {
    message: errorMessage,
    originalError: error
  };
};

export const triggerSyntaxError = () => {
  try {
    eval('foo syntaxerror');
  } catch (error) {
    displayGlobalError(`Syntax Error: ${error.message}`);
  }
};

export { ErrorBoundary, useErrorHandler, handleApiError };