
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Trash2, ChevronDown, ChevronUp, Book } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface LessonContent {
  id: number;
  lesson_id: number;
  title: string;
  content: string[];
  order: number;
}

interface Lesson {
  id: number;
  title: string;
}

interface LessonContentListProps {
  lessonContent: LessonContent[];
  lessons: Lesson[];
  onContentDeleted: () => void;
}

const LessonContentList = ({ 
  lessonContent, 
  lessons, 
  onContentDeleted 
}: LessonContentListProps) => {
  const [viewingContent, setViewingContent] = useState<LessonContent | null>(null);
  const [expandedContent, setExpandedContent] = useState<number | null>(null);
  
  const getLessonTitle = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    return lesson ? lesson.title : "Unknown Lesson";
  };
  
  const handleDeleteContent = async (id: number) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this lesson content?");
      if (!confirmed) return;
      
      const { error } = await supabase
        .from('lesson_content' as any)
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast.success("Lesson content deleted successfully");
      onContentDeleted();
    } catch (error) {
      console.error("Error deleting lesson content:", error);
      toast.error("Failed to delete lesson content");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Lesson Content List</h2>
      
      {lessonContent.length === 0 ? (
        <p className="text-gray-500 italic">No lesson content found. Add some using the form above.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Lesson</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessonContent.map((content) => (
                <TableRow key={content.id}>
                  <TableCell className="font-medium">{content.title}</TableCell>
                  <TableCell>{getLessonTitle(content.lesson_id)}</TableCell>
                  <TableCell>{content.order}</TableCell>
                  <TableCell>{content.content.length} pages</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button 
                            variant="outline"
                            size="sm" 
                            onClick={() => setViewingContent(content)}
                          >
                            <Book className="h-4 w-4" />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <div className="mx-auto w-full max-w-3xl">
                            <DrawerHeader>
                              <DrawerTitle>{content.title}</DrawerTitle>
                              <DrawerDescription>
                                From lesson: {getLessonTitle(content.lesson_id)}
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 space-y-4">
                              {content.content.map((page, index) => (
                                <div key={index} className="border p-4 rounded-md">
                                  <h3 className="font-medium mb-2">Page {index + 1}</h3>
                                  <div className="whitespace-pre-wrap">{page}</div>
                                </div>
                              ))}
                            </div>
                            <DrawerFooter>
                              <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </div>
                        </DrawerContent>
                      </Drawer>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteContent(content.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default LessonContentList;
