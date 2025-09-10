import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong.</h1>
          <p className="mt-2 text-gray-700">We're sorry for the inconvenience. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;