
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container max-w-6xl mx-auto px-4 py-20 text-center">
        {/* Small Label */}
        <div className="inline-block px-4 py-2 mb-8 bg-[#FFF9E6] rounded-full">
          <span className="text-sm font-medium">Master Your Finances</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Learn Finance,{" "}
          <span className="text-primary">
            One Lesson
            <br />
            at a Time
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto mb-12">
          Master financial literacy through bite-sized, interactive lessons. Start
          your journey to financial freedom today.
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          className="bg-primary hover:bg-primary-hover text-white px-8 py-6 text-lg rounded-full"
          onClick={() => navigate('/lessons')}
        >
          Start Learning
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
