import { useState, useEffect } from "react";
import NavigationBar from "@/components/customui/NavigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import toast from "react-hot-toast";
import { fetchFactories, fetchFactorySections, addFactory, addFactorySection, deleteFactorySection } from '@/services/FactoriesService';
import { addMachine, deleteMachine, fetchAllMachines } from "@/services/MachineServices"


import { Factory,  } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface FactorySection {
  id: number;
  name: string;
  factory_id: number;
  factories?: any; // Optional if not always present
}

interface Machine {
  id: number;
  name: string;
  is_running: boolean;
  factory_section_id: number;
  factory_sections?: any[]; // Mark as optional
}


const ManagementPage = () => {
  const [factories, setFactories] = useState<Factory[]>();
  const [factorySections, setFactorySections] = useState<FactorySection[]>();
  const [machines, setMachines] = useState<Machine[]>();
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);
  const [selectedFactorySection, setSelectedFactorySection] = useState<FactorySection | null>(null);

  const [newFactoryName, setNewFactoryName] = useState("");
  const [newFactoryAbbreviation, setNewFactoryAbbreviation] = useState('');
  const [newSectionName, setNewSectionName] = useState("");
  const [newMachineName, setNewMachineName] = useState("");

  const [showFactoryInputs, setShowFactoryInputs] = useState(false);
  const [showSectionInputs, setShowSectionInputs] = useState(false);
  const [showMachineInputs, setShowMachineInputs] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);

  const openDeleteModal = (machine: Machine) => {
    setMachineToDelete(machine);
    setDeleteModalOpen(true);
  };

  const confirmDeleteMachine = async () => {
    if (machineToDelete) {
      try {
        if (await deleteMachine(machineToDelete.id)) {
          const updatedMachines = await fetchAllMachines(selectedFactorySection?.id);
          setMachines(updatedMachines.data);
        }
      } catch (error) {
        toast.error("Failed to delete machine");
      } finally {
        setDeleteModalOpen(false);
        setMachineToDelete(null);
      }
    }
  };

  // Load factories
  useEffect(() => {
    const loadFactories = async () => {
      try {
        const fetchedFactories = await fetchFactories();
        setFactories(fetchedFactories);
      } catch (error) {
        toast.error("Failed to load factories");
      }
    };

    loadFactories();
  }, []);

  // Load factory sections and machines when a factory is selected
  useEffect(() => {
    const loadFactorySections = async () => {
      if (selectedFactory) {
        try {
          const sections = await fetchFactorySections(selectedFactory.id);
          setFactorySections(sections);
        } catch (error) {
          toast.error("Failed to load factory sections");
        }
        setMachines([])
        setSelectedFactorySection(null)
      }
    };

    loadFactorySections();
  }, [selectedFactory]);

  useEffect(() => {
    const loadMachines = async () => {
      if (selectedFactorySection) {
        try {
          const machines = await fetchAllMachines(selectedFactorySection.id);
          setMachines(machines.data);
        } catch (error) {
          toast.error("Failed to load machines");
        }
      } else {
        // Clear machines when no factory section is selected
        setMachines([]);
      }
    };

    loadMachines();
  }, [selectedFactory,selectedFactorySection]);

  const handleAddFactory = async () => {
    if (!newFactoryName.trim()) return;
    try {
      await addFactory(newFactoryName, newFactoryAbbreviation);
      toast.success("Factory added successfully");
      setNewFactoryName("");
      const updatedFactories = await fetchFactories();
      setFactories(updatedFactories);
    } catch (error) {
      toast.error("Failed to add factory");
    }
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim() || !selectedFactory) return;
    try {
      await addFactorySection(newSectionName, selectedFactory.id);
      toast.success("Section added successfully");
      setNewSectionName("");
      const updatedSections = await fetchFactorySections(selectedFactory.id);
      setFactorySections(updatedSections);
    } catch (error) {
      toast.error("Failed to add section");
    }
  };

  // const handleDeleteSection = async (sectionId: number) => {
  //   try {
  //     if (!selectedFactory) {
  //       toast.error("No factory selected. Please select a factory first.");
  //       return;
  //     }

  //     await deleteFactorySection(sectionId);
  //     toast.success("Section deleted successfully");

  //     // Fetch updated sections for the selected factory
  //     const updatedSections = await fetchFactorySections(selectedFactory.id);
  //     setFactorySections(updatedSections);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to delete section");
  //   }
  // };

  const handleAddMachine = async () => {
    if (!newMachineName.trim() || !selectedFactorySection) return;
    try {
      await addMachine(newMachineName, selectedFactorySection.id);
      
      setNewMachineName("");
      const updatedMachines = await fetchAllMachines(selectedFactorySection.id);
      setMachines(updatedMachines.data);
    } catch (error) {
      toast.error("Failed to add machine");
    }
  };

  

  const handleDeleteMachine = async (machineId: number) => {
    try {
      if(await deleteMachine(machineId))
        {
        const updatedMachines = await fetchAllMachines(selectedFactorySection?.id);
        setMachines(updatedMachines.data);}
    } catch (error) {
      toast.error("Failed to delete machine");
    }
  };

  

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen w-full bg-muted/40 p-6">
        <h1 className="text-2xl font-bold mb-4">Factory Management</h1>

        {/* Dialog for Delete Confirmation */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <p>
              Are you sure you want to delete <strong>{machineToDelete?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteMachine}>
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Factory Management */}
        <Accordion type="multiple" className="w-full">
        <AccordionItem value="factory-management">
            <AccordionTrigger>Factory Management
              {selectedFactory && ` - ${selectedFactory.name}`}</AccordionTrigger>
          <AccordionContent>
            <Button onClick={() => setShowFactoryInputs(!showFactoryInputs)}>
              {showFactoryInputs ? "Cancel" : "Add Factory"}
            </Button>
            {showFactoryInputs && (
              <div className="mt-4 flex items-center gap-2">
                <Input
                  value={newFactoryName}
                  onChange={(e) => setNewFactoryName(e.target.value)}
                  placeholder="Enter factory name"
                />
                <Input
                  value={newFactoryAbbreviation}
                  onChange={(e) => setNewFactoryAbbreviation(e.target.value)}
                  placeholder="Enter factory abbreviation"
                />
                <Button onClick={handleAddFactory}>Submit</Button>
              </div>
            )}
            <h2 className="text-xl font-semibold mt-4">Factories</h2>
            <Table>
              {factories?.map((factory) => (
                <TableRow key={factory.id} className="hover:bg-gray-100">
                  <TableCell
                    onClick={() => setSelectedFactory(factory)}
                    className="cursor-pointer"
                  >
                    {factory.name}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </AccordionContent>
        </AccordionItem>

        

        {/* Factory Section Management */}
        {selectedFactory && (
          <AccordionItem value="factory-section-management">
              <AccordionTrigger>Factory Section Management {selectedFactorySection && ` - ${selectedFactorySection.name}`}</AccordionTrigger>
            <AccordionContent>
              <Button onClick={() => setShowSectionInputs(!showSectionInputs)}>
                {showSectionInputs ? "Cancel" : "Add Section"}
              </Button>
              {showSectionInputs && (
                <div className="mt-4 flex items-center gap-2">
                  <Input
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="Enter section name"
                  />
                  <Button onClick={handleAddSection}>Submit</Button>
                </div>
              )}
              <h2 className="text-xl font-semibold mt-4">
                Sections in {selectedFactory.name}
              </h2>
              <Table>
                {factorySections?.map((section) => (
                  <TableRow
                    key={section.id}
                    className={`hover:bg-gray-100 cursor-pointer ${selectedFactorySection?.id === section.id ? "bg-gray-200" : ""
                      }`}
                    onClick={() => setSelectedFactorySection(section)}
                  >
                    <TableCell>{section.name}</TableCell>
                  </TableRow>
                ))}
              </Table>
            </AccordionContent>
          </AccordionItem>
        )}

            {/* Machine Management */}
        {selectedFactorySection && (
          <AccordionItem value="machine-management">
            <AccordionTrigger>Machine Management</AccordionTrigger>
            <AccordionContent>
              <Button onClick={() => setShowMachineInputs(!showMachineInputs)}>
                {showMachineInputs ? "Cancel" : "Add Machine"}
              </Button>
              {showMachineInputs && (
                <div className="mt-4 flex items-center gap-2">
                  <Input
                    value={newMachineName}
                    onChange={(e) => setNewMachineName(e.target.value)}
                    placeholder="Enter machine name"
                  />
                  <Button onClick={handleAddMachine}>Submit</Button>
                </div>
              )}
              <h2 className="text-xl font-semibold mt-4">
                Machines in Section: {selectedFactorySection.name}
              </h2>
              
              <Table>
                {machines?.map((machine) => (
                  <TableRow key={machine.id} className="hover:bg-gray-100">
                    <TableCell>{machine.name}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteModal(machine)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
      </div>
    </>
  );
};

export default ManagementPage;
