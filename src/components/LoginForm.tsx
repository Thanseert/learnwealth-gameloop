
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export function LoginForm() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    timeCommitment: "",
    level: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userData", JSON.stringify(formData));
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md border-none shadow-xl bg-white/80 backdrop-blur-sm relative">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 md:mb-4">
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold text-gray-800">
            Start Your Learning Journey
          </CardTitle>
          <CardDescription className="text-sm md:text-base text-gray-600">
            Join our community of financial learners and begin your path to financial literacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(123) 456-7890"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="timeCommitment" className="text-gray-700">Daily Time Commitment</Label>
              <Select
                value={formData.timeCommitment}
                onValueChange={(value) =>
                  setFormData({ ...formData, timeCommitment: value })
                }
              >
                <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="How much time can you dedicate?" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5} className="z-50">
                  <SelectItem value="2-5">2-5 minutes</SelectItem>
                  <SelectItem value="5-10">5-10 minutes</SelectItem>
                  <SelectItem value="10-15">10-15 minutes</SelectItem>
                  <SelectItem value="15+">15+ minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="level" className="text-gray-700">Experience Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) =>
                  setFormData({ ...formData, level: value })
                }
              >
                <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="What's your current knowledge level?" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5} className="z-50">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 py-5 md:py-6"
            >
              Begin Your Journey
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
