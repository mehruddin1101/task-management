import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Pencil, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import AddTaskModal from "./modals/AddTaskModal";
import axiosClient from "../../utils/axiosClient";
import { toast, Toaster } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can make this configurable

  const getAllTasks = async () => {
    try {
      setLoading(true);
      const response = await axiosClient("/task/list");
      if (response?.data) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error("Failed to fetch tasks", {
        description: error.response?.data?.message || "Please try again later",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      await axiosClient.delete(`/task/${taskToDelete.id}`);
      toast.success("Task deleted successfully", {
        description: `${taskToDelete.title} has been removed`,
      });
      getAllTasks();
    } catch (error) {
      toast.error("Failed to delete task", {
        description: error.response?.data?.message || "Please try again",
      });
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToFirstPage = () => paginate(1);
  const goToLastPage = () => paginate(totalPages);
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };
  const goToPrevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <Toaster richColors />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task{" "}
              <span className="font-semibold text-gray-900">
                {taskToDelete?.title}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
            >
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ✨ Task Management Board
        </h2>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 hover:scale-105"
          onClick={() => setIsOpen(true)}
        >
          + Add New Task
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
        <Table className="divide-y divide-gray-100/80">
          <TableHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-5 text-gray-600 font-semibold text-sm uppercase tracking-wide w-[30%]">
                Task Title
              </TableHead>
              <TableHead className="py-5 text-gray-600 font-semibold text-sm uppercase tracking-wide w-[55%]">
                Description
              </TableHead>
              <TableHead className="py-5 text-gray-600 font-semibold text-sm uppercase tracking-wide text-right w-[15%]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100/80">
            {!loading &&
              currentItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="group transition-all duration-200 hover:bg-gray-50/50"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 bg-blue-500 rounded-full mr-3 shadow-sm" />
                      <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <p className="text-gray-600 max-w-2xl leading-relaxed">
                      {item.description}
                    </p>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end space-x-10 mr-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 p-2 w-10 rounded-lg bg-white hover:bg-gray-100 text-gray-500 hover:text-red-600 shadow-sm border transition-all duration-200 hover:scale-105"
                        onClick={() => handleDeleteClick(item)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-gray-400 mb-4">📭</div>
            <h3 className="text-gray-500 font-medium mb-2">No tasks found</h3>
            <p className="text-gray-400 text-sm">Start by adding a new task</p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsOpen(true)}
            >
              Create Your First Task
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500">
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading tasks...
            </div>
          </div>
        )}

        {/* Pagination */}
        {data.length > itemsPerPage && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, data.length)} of {data.length} tasks
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(number)}
                      className="h-8 w-8 p-0"
                    >
                      {number}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSuccess={getAllTasks}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
    </div>
  );
};

export default DataTable;