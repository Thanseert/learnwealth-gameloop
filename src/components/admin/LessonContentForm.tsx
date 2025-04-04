
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Minus, Save } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
}

interface LessonContentFormProps {
  lessons: Lesson[];
  onContentUpdated: () => void;
  editingContent?: {
    id: number;
    lesson_id: number;
    title: string;
    content: string[];
    order: number;
  } | null;
}

const LessonContentForm = ({ 
  lessons, 
  onContentUpdated,
  editingContent = null 
}: LessonContentFormProps) => {
  const [formData, setFormData] = useState(
    editingContent ? 
    {
      lesson_id: editingContent.lesson_id,
      title: editingContent.title,
      content: editingContent.content,
      order: editingContent.order
    } : {
      lesson_id: lessons[0]?.id || 0,
      title: "",
      content: [""],
      order: 0
    }
  );

  const handleAddContentItem = () => {
    setFormData({
      ...formData,
      content: [...formData.content, ""]
    });
  };

  const handleRemoveContentItem = (index: number) => {
    if (formData.content.length <= 1) {
      toast.error("You need at least one content item");
      return;
    }

    const newContent = [...formData.content];
    newContent.splice(index, 1);
    setFormData({
      ...formData,
      content: newContent
    });
  };

  const handleContentChange = (value: string, index: number) => {
    const newContent = [...formData.content];
    newContent[index] = value;
    setFormData({
      ...formData,
      content: newContent
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.title.trim()) {
        toast.error("Please enter a title");
        return;
      }

      if (formData.content.some(item => !item.trim())) {
        toast.error("Please fill all content items");
        return;
      }

      if (!formData.lesson_id) {
        toast.error("Please select a lesson");
        return;
      }

      if (editingContent) {
        // Update existing content
        const { error } = await supabase
          .from("lesson_content")
          .update({
            lesson_id: formData.lesson_id,
            title: formData.title,
            content: formData.content,
            order: formData.order
          })
          .eq("id", editingContent.id);

        if (error) throw error;
        toast.success("Lesson content updated successfully");
      } else {
        // Add new content
        const { error } = await supabase
          .from("lesson_content")
          .insert([{
            lesson_id: formData.lesson_id,
            title: formData.title,
            content: formData.content,
            order: formData.order
          }]);

        if (error) throw error;
        toast.success("Lesson content added successfully");
      }

      // Reset form if adding new content
      if (!editingContent) {
        setFormData({
          lesson_id: formData.lesson_id,
          title: "",
          content: [""],
          order: 0
        });
      }

      // Notify parent component of the update
      onContentUpdated();
      
    } catch (error) {
      console.error("Error submitting lesson content:", error);
      toast.error("Failed to save lesson content");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{editingContent ? "Edit" : "Add"} Lesson Content</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="lesson">Lesson</Label>
          <select
            id="lesson"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.lesson_id}
            onChange={(e) => setFormData({ ...formData, lesson_id: parseInt(e.target.value) })}
          >
            <option value="">Select a lesson</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="title">Content Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter content title"
          />
        </div>

        <div>
          <Label htmlFor="order">Display Order</Label>
          <Input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            placeholder="Enter display order (lower numbers first)"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Content Pages</Label>
            <Button 
              type="button" 
              onClick={handleAddContentItem}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Page
            </Button>
          </div>

          {formData.content.map((content, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor={`content-${index}`}>Page {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveContentItem(index)}
                    className="text-red-500 h-8 px-2"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  id={`content-${index}`}
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value, index)}
                  placeholder="Enter content for this page"
                  rows={5}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-1" />
            {editingContent ? "Update" : "Add"} Lesson Content
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonContentForm;
