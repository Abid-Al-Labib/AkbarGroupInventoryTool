import { useEffect, useState } from "react";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";
import { fetchFactories, fetchFactorySections } from "@/services/FactoriesService";
import { fetchAllMachines, addMachine, deleteMachine } from "@/services/MachineServices";
import { XCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Factory, FactorySection } from "@/types";

const MachineManagementCard = () => {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [selectedFactoryId, setSelectedFactoryId] = useState<number | null>(null);
  const [factorySections, setFactorySections] = useState<FactorySection[]>([]);
  const [selectedFactorySectionId, setSelectedFactorySectionId] = useState<number | null>(null);
  const [machines, setMachines] = useState<{ id: number; name: string }[]>([]);
  const [newMachineName, setNewMachineName] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const factoryFromUrl = searchParams.get("factory");
    const sectionFromUrl = searchParams.get("factorySection");
  
    setSelectedFactoryId(factoryFromUrl ? Number(factoryFromUrl) : null);
  
    if (factoryFromUrl) {
      fetchFactorySections(Number(factoryFromUrl)).then((sections) => {
        setFactorySections(sections);
  
        if (sectionFromUrl && sections.some(s => s.id === Number(sectionFromUrl))) {
          setSelectedFactorySectionId(Number(sectionFromUrl));
        } else {
          setSelectedFactorySectionId(null);
        }
      });
    } else {
      setFactorySections([]);
      setSelectedFactorySectionId(null);
    }
  }, [searchParams]);

  const handleFactoryChange = (value: string) => {
    const newFactoryId = Number(value);
    setSelectedFactoryId(newFactoryId);
      setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      updatedParams.set("factory", newFactoryId.toString());
      updatedParams.delete("factorySection");
      return updatedParams;
    });
  };

  const handleFactorySectionChange = (value: string) => {
    const newFactorySectionId = Number(value);
    setSelectedFactorySectionId(newFactorySectionId);
      setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      updatedParams.set("factorySection", newFactorySectionId.toString());
      return updatedParams;
    });
  };

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

  useEffect(() => {
    if (selectedFactoryId !== null) {
      const loadSections = async () => {
        try {
          const sections = await fetchFactorySections(selectedFactoryId);
          setFactorySections(sections);
  
          const sectionFromUrl = searchParams.get("factorySection");
          if (sectionFromUrl && sections.some(s => s.id === Number(sectionFromUrl))) {
            setSelectedFactorySectionId(Number(sectionFromUrl));
          } else {
            setSelectedFactorySectionId(null);
          }
        } catch (error) {
          toast.error("Failed to load factory sections.");
        }
      };
      loadSections();
    } else {
      setFactorySections([]);
      setSelectedFactorySectionId(null);
    }
  }, [selectedFactoryId]);

  useEffect(() => {
    if (selectedFactorySectionId !== null) {
      loadMachines(selectedFactorySectionId);
    } else {
      setMachines([]);
    }
  }, [selectedFactorySectionId]);


  const loadMachines = async (factorySectionId: number) => {
    try {
      const response = await fetchAllMachines(factorySectionId);
      setMachines(response); // Directly use the array
    } catch (error) {
      toast.error("Failed to load machines.");
    }
  };

  const handleAddMachine = async () => {
    if (!newMachineName.trim() || selectedFactorySectionId === null) {
      toast.error("Please select a factory section and enter a machine name.");
      return;
    }

    try {
      await addMachine(newMachineName, selectedFactorySectionId);
      toast.success("Machine added successfully!");
      setNewMachineName("");
      loadMachines(selectedFactorySectionId);
    } catch (error) {
      toast.error("Error adding machine.");
    }
  };

  const handleDeleteMachine = async (machineId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this machine?");
    if (!confirmed) return;

    try {
      const success = await deleteMachine(machineId);
      if (success) {
        loadMachines(selectedFactorySectionId!);
      }
    } catch (error) {
      toast.error("Failed to delete machine.");
    }
  };

  return (
    <div className="w-full max-w-2xl p-4">
        <div className="space-y-4">
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

        {/* Select Factory Section */}
        {selectedFactoryId && (
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Select Factory Section</label>
            <Select value={selectedFactorySectionId?.toString() || ""} onValueChange={handleFactorySectionChange}>
              <SelectTrigger className="w-full">
                <SelectValue>{selectedFactorySectionId ? factorySections.find(s => s.id === selectedFactorySectionId)?.name : "Select Section"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {factorySections.map((section) => (
                  <SelectItem key={section.id} value={section.id.toString()}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Add New Machine */}
        {selectedFactorySectionId && (
          <>
            <div className="flex gap-2">
              <Input
                placeholder="Machine Name"
                value={newMachineName}
                onChange={(e) => setNewMachineName(e.target.value)}
              />
              <Button onClick={handleAddMachine}>Add</Button>
            </div>

            {/* Scrollable Machine List */}
            <div className="max-h-64 overflow-y-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {machines.length > 0 ? (
                    machines.map((machine) => (
                      <TableRow key={machine.id}>
                        <TableCell>{machine.id}</TableCell>
                        <TableCell>{machine.name}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleDeleteMachine(machine.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <XCircle size={18} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                        No Machines Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
       </div>
    </div>
  );
};

export default MachineManagementCard;
