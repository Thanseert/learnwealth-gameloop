
import { LoginForm } from "@/components/LoginForm";

const Index = () => {
  // Check if user is already logged in
  const userData = localStorage.getItem("userData");

  if (userData) {
    // If user is logged in, show the welcome back message
    const user = JSON.parse(userData);
    return (
      <div className="min-h-screen bg-white">
        <div className="container max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Welcome back, <span className="text-primary">{user.name}</span>!
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto mb-12">
            Continue your financial education journey
          </p>
          <a
            href="/lessons"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-full"
          >
            Continue Learning
          </a>
        </div>
      </div>
    );
  }

  // If user is not logged in, show the login form
  return <LoginForm />;
};

export default Index;
