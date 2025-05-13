
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PencilIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface EditNoteDialogProps {
  itemName: string;
  currentNote: string;
  onSaveNote: (note: string) => void;
}

const EditNoteDialog: React.FC<EditNoteDialogProps> = ({ 
  itemName, 
  currentNote, 
  onSaveNote 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState(currentNote);
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setNote(currentNote);
    }
  };

  const handleSave = () => {
    onSaveNote(note);
    setIsOpen(false);
    toast({
      title: "Note updated",
      description: `Your note for ${itemName} has been updated.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0 rounded-full text-gray-500 hover:text-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <PencilIcon size={16} />
        <span className="sr-only">Edit note</span>
      </Button>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit note for {itemName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="note">Special instructions</Label>
            <Textarea
              id="note"
              placeholder="Add special requests, allergies, etc."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;
