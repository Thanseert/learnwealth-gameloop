
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Lesson {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  xp: number;
  order: number;
}

interface LevelListProps {
  lessons: Lesson[];
  onLevelDeleted: () => void;
}

const LevelList = ({ lessons, onLevelDeleted }: LevelListProps) => {
  const handleDeleteLevel = async (id: number) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this level? This will also delete any questions associated with this level.');
      if (!confirmed) return;
      
      // First check if there are any questions associated with this level
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('id')
        .eq('lesson_id', id);
        
      if (questionsError) throw questionsError;
      
      // Delete any associated questions first
      if (questionsData && questionsData.length > 0) {
        const { error: deleteQuestionsError } = await supabase
          .from('questions')
          .delete()
          .eq('lesson_id', id);
          
        if (deleteQuestionsError) throw deleteQuestionsError;
      }
      
      // Now delete the level
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Level deleted successfully');
      onLevelDeleted();
    } catch (err) {
      console.error('Error deleting level:', err);
      toast.error('Error deleting level');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Manage Levels</h2>
      <div className="space-y-4">
        {lessons.length === 0 ? (
          <p className="text-gray-500">No levels found.</p>
        ) : (
          lessons.map((lesson: Lesson) => (
            <div key={lesson.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{lesson.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      lesson.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                      lesson.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {lesson.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                  <div className="mt-2 text-xs text-gray-500 space-x-2">
                    <span>Order: {lesson.order}</span>
                    <span>XP: {lesson.xp}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteLevel(lesson.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LevelList;
