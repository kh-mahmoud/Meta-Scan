import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { MouseEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash } from "lucide-react";

const ActionModal = ({ jobId }: { jobId: Id<"reports"> }) => {
  const deleteReport = useMutation(api.scraping.deleteReport);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await deleteReport({ reportId: jobId });
      toast.success("Report deleted successfully.");
    } catch (error) {
      console.error("Failed to delete report:", error);
      toast.error("Failed to delete report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          onClick={(e: MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
        >
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Delete this report?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            report and remove it from your dashboard.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionModal;
