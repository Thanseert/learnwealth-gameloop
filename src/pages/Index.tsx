
import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";

const Index = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const userData = localStorage.getItem("userData");

  if (userData) {
    // If user is logged in, show the welcome back message
    const user = JSON.parse(userData);
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container max-w-6xl mx-auto px-4 py-20">
          <div className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Welcome back, <span className="text-primary">{user.name}</span>!
            </h1>
            <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto">
              Continue your financial education journey
            </p>
            <a
              href="/lessons"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
            >
              Continue Learning
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (showLoginForm) {
    return <LoginForm />;
  }

  // Landing page for non-logged in users
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            Master Your <span className="text-primary">Financial Future</span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto">
            Learn essential financial skills through interactive lessons and quizzes.
            Start your journey to financial literacy today.
          </p>
          <button
            onClick={() => setShowLoginForm(true)}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
