import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Upload } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  category: z.string(),
});

export function ProductUploadForm() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedFile || !selectedImage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both a product file and an image",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload product file
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: fileError } = await supabase.storage
        .from("products")
        .upload(fileName, selectedFile);

      if (fileError) throw fileError;

      // Upload image
      const imageExt = selectedImage.name.split(".").pop();
      const imageName = `${Math.random()}.${imageExt}`;
      const { error: imageError } = await supabase.storage
        .from("products")
        .upload(`images/${imageName}`, selectedImage);

      if (imageError) throw imageError;

      // Get the public URLs
      const fileUrl = supabase.storage.from("products").getPublicUrl(fileName)
        .data.publicUrl;
      const imageUrl = supabase.storage
        .from("products")
        .getPublicUrl(`images/${imageName}`).data.publicUrl;

      // Create product record
      const { error: dbError } = await supabase.from("products").insert({
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        category: values.category,
        file_url: fileUrl,
        image_url: imageUrl,
      });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Product uploaded successfully",
      });

      form.reset();
      setSelectedFile(null);
      setSelectedImage(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload product",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Premium Website Template" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your digital product..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="29.99"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="templates">Templates</SelectItem>
                  <SelectItem value="graphics">Graphics</SelectItem>
                  <SelectItem value="themes">Themes</SelectItem>
                  <SelectItem value="photos">Photos</SelectItem>
                  <SelectItem value="ui-kits">UI Kits</SelectItem>
                  <SelectItem value="icons">Icons</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormItem>
            <FormLabel>Product File</FormLabel>
            <FormControl>
              <Input
                type="file"
                onChange={(e) =>
                  setSelectedFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </FormControl>
            <FormDescription>
              Upload your digital product file (ZIP, PDF, etc.)
            </FormDescription>
          </FormItem>

          <FormItem>
            <FormLabel>Product Image</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedImage(e.target.files ? e.target.files[0] : null)
                }
              />
            </FormControl>
            <FormDescription>
              Upload a preview image for your product
            </FormDescription>
          </FormItem>
        </div>

        <Button type="submit" disabled={isUploading}>
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Upload Product
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
