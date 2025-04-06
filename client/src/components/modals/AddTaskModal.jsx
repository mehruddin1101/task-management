import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Plus } from "lucide-react";
import axiosClient from "../../../utils/axiosClient";
import { Toaster, toast } from "sonner";


const AddTaskModal = ({ isOpen, setIsOpen,onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosClient.post("/task/create", formData);
      if (response.data.success) {
        setIsOpen(false);
        onSuccess()
        setFormData({
          title: "",
          description: "",
        });
      }
      toast.success("Task Cretaed successfully", {
       
        action: {
          label:"success",
          // onClick: () => console.log("Undo delete would go here"),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Toaster richColors />
        <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden rounded-2xl border-0">
          <div className="relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-60" />

            <div className="relative z-10">
              <DialogHeader className="border-b border-gray-100/50 px-8 py-5">
                <DialogTitle className="flex items-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <Plus className="mr-3 h-6 w-6 text-purple-600" />
                  Create New Task
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 px-8 py-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all"
                      placeholder="Enter task title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="min-h-[120px] rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all"
                      placeholder="Describe the task details..."
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 border-t border-gray-100/50 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="h-11 px-6 rounded-xl border-gray-200 text-gray-600 hover:text-gray-700 shadow-sm hover:bg-gray-50/80 transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all hover:scale-105"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTaskModal;
