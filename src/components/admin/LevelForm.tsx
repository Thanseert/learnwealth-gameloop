
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Lesson {
  id: number;
  title: string;
}

interface LevelFormProps {
  onLevelAdded: () => void;
}

type DifficultyLevel = "easy" | "medium" | "hard";

const LevelForm = ({ onLevelAdded }: LevelFormProps) => {
  const [newLevel, setNewLevel] = useState({
    title: "",
    description: "",
    difficulty: "easy" as DifficultyLevel,
    xp: 100,
    order: 0
  });

  const handleAddLevel = async () => {
    try {
      // Validate form
      if (!newLevel.title || !newLevel.description) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Insert new level into the database
      const { data, error } = await supabase
        .from('lessons')
        .insert([
          {
            title: newLevel.title,
            description: newLevel.description,
            difficulty: newLevel.difficulty,
            xp: newLevel.xp,
            order: newLevel.order
          }
        ]);

      if (error) throw error;
      
      toast.success("Level added successfully");
      
      // Reset form
      setNewLevel({
        title: "",
        description: "",
        difficulty: "easy" as DifficultyLevel,
        xp: 100,
        order: 0
      });
      
      // Notify parent component to refresh data
      onLevelAdded();
    } catch (err) {
      console.error("Error adding level:", err);
      toast.error("Error adding level");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Add New Level</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Level Title</Label>
          <Input
            id="title"
            value={newLevel.title}
            onChange={(e) => setNewLevel({ ...newLevel, title: e.target.value })}
            placeholder="Enter level title"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={newLevel.description}
            onChange={(e) => setNewLevel({ ...newLevel, description: e.target.value })}
            placeholder="Enter level description"
          />
        </div>
        
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <select 
            id="difficulty"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            value={newLevel.difficulty}
            onChange={(e) => setNewLevel({ ...newLevel, difficulty: e.target.value as DifficultyLevel })}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="xp">XP Points</Label>
          <Input
            id="xp"
            type="number"
            value={newLevel.xp}
            onChange={(e) => setNewLevel({ ...newLevel, xp: parseInt(e.target.value) || 0 })}
            placeholder="Enter XP points for completion"
          />
        </div>
        
        <div>
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            value={newLevel.order}
            onChange={(e) => setNewLevel({ ...newLevel, order: parseInt(e.target.value) || 0 })}
            placeholder="Enter display order (lower numbers first)"
          />
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleAddLevel}>
            Add Level
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LevelForm;
