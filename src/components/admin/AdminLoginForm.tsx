
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// The admin password - in a real application, this would be stored server-side or in environment variables
const ADMIN_PASSWORD = "adminPass123";

interface AdminLoginFormProps {
  isAdmin: boolean;
  onAuthenticated: () => void;
}

const AdminLoginForm = ({ isAdmin, onAuthenticated }: AdminLoginFormProps) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleAdminLogin = () => {
    if (password === ADMIN_PASSWORD) {
      onAuthenticated();
      toast.success("Admin authentication successful");
      localStorage.setItem("adminAuthenticated", "true");
    } else {
      toast.error("Incorrect admin password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <CardTitle>Admin Authentication</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">Please enter the admin password to continue.</p>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdminLogin();
                }}
              />
            </div>
            <Button onClick={handleAdminLogin} className="w-full">
              Access Admin Panel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
