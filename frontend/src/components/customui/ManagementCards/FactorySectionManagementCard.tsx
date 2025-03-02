import { useEffect, useState } from "react";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";
import { fetchFactories, fetchFactorySections, addFactorySection, deleteFactorySection } from "@/services/FactoriesService";
import { XCircle } from "lucide-react"; 
import { useSearchParams } from "react-router-dom";
import { Factory, FactorySection } from "@/types";

const FactorySectionManagementCard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const factoryIdFromUrl = searchParams.get("factory");

  const [factories, setFactories] = useState<Factory[]>([]);
  const [selectedFactoryId, setSelectedFactoryId] = useState<number | null>(
    factoryIdFromUrl ? Number(factoryIdFromUrl) : null
  );  

  const [factorySection, setFactorySections] = useState<FactorySection[]>([]);
  const [newSectionName, setNewSectionName] = useState("");

  const handleFactoryChange = (value: string) => {
    const newFactoryId = Number(value);
    setSelectedFactoryId(newFactoryId);
      setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      updatedParams.set("factory", newFactoryId.toString());
      return updatedParams;
    });
  };

  useEffect(() => {
    const factoryFromUrl = searchParams.get("factory");
    if (factoryFromUrl) {
      setSelectedFactoryId(Number(factoryFromUrl));
    }
  }, [searchParams]); 
  
  // Load factories on mount
  useEffect(() => {
    const loadFactories = async () => {
      try {
        const data = await fetchFactories();
        setFactories(data);
      } catch (error) {
        toast.error("Failed to load factories.");
      }
    };
    loadFactories();
  }, []);

  // Load factory sections when a factory is selected
  useEffect(() => {
    if (selectedFactoryId !== null) {
      loadFactorySections(selectedFactoryId);
    } else {
      setFactorySections([]); // Reset sections when no factory is selected
    }
  }, [selectedFactoryId]);

  const loadFactorySections = async (factoryId: number) => {
    try {
      const data = await fetchFactorySections(factoryId);
      setFactorySections(data);
    } catch (error) {
      toast.error("Failed to load factory sections.");
    }
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim() || selectedFactoryId === null) {
      toast.error("Please select a factory and enter a section name.");
      return;
    }

    try {
      await addFactorySection(newSectionName, selectedFactoryId);
      setNewSectionName("");
      loadFactorySections(selectedFactoryId); // Refresh the list
    } catch (error) {
      toast.error("Error adding factory section.");
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this factory section?");
    if (!confirmed) return;

    try {
      const success = await deleteFactorySection(sectionId);
      if (success) {
        loadFactorySections(selectedFactoryId!); // Refresh list after deletion
      }
    } catch (error) {
      toast.error("Failed to delete factory section.");
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Select Factory */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Select Factory</label>
        <Select value={selectedFactoryId?.toString() || ""} onValueChange={handleFactoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue>{selectedFactoryId ? factories.find(f => f.id === selectedFactoryId)?.name : "Select Factory"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {factories.map((factory) => (
              <SelectItem key={factory.id} value={factory.id.toString()}>
                {factory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add New Section */}
      {selectedFactoryId && (
        <>
          <div className="flex gap-2">
            <Input
              placeholder="Factory Section Name"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
            />
            <Button onClick={handleAddSection}>Add</Button>
          </div>

          {/* List Sections (Scrollable) */}
            <div className="border rounded-md shadow-sm max-h-80 overflow-y-auto relative">
              <Table>
                <TableHeader className="top-0 bg-white shadow-sm z-10">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factorySection.map((section) => (
                    <TableRow key={section.id}>
                      <TableCell>{section.id}</TableCell>
                      <TableCell>{section.name}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <XCircle size={18} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
        </>
      )}
    </div>
  );
};

export default FactorySectionManagementCard;
