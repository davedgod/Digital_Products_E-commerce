import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductUploadForm } from "./ProductUploadForm";

export function ProductUploadDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to list your digital product.
          </DialogDescription>
        </DialogHeader>
        <ProductUploadForm />
      </DialogContent>
    </Dialog>
  );
}
