import { useEffect, useState } from "react";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";
import { fetchFactories, fetchFactorySections } from "@/services/FactoriesService";
import { fetchAllMachines } from "@/services/MachineServices";
import { fetchMachineParts, upsertMachineParts, updateMachinePartQuantities, deleteMachinePart } from "@/services/MachinePartsService";
import { Check, PencilOff, PencilRuler, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Factory, FactorySection, Machine, MachinePart } from "@/types";

const MachinePartsManagementCard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [factories, setFactories] = useState<Factory[]>([]);
  const [factorySections, setFactorySections] = useState<FactorySection[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [machineParts, setMachineParts] = useState<MachinePart[]>([]); // Machine parts list

  const factoryFromUrl = searchParams.get("factory");
  const sectionFromUrl = searchParams.get("factorySection");
  const machineFromUrl = searchParams.get("machine");

  const [selectedFactoryId, setSelectedFactoryId] = useState<number | null>(
    factoryFromUrl ? Number(factoryFromUrl) : null
  );
  const [selectedFactorySectionId, setSelectedFactorySectionId] = useState<number | null>(
    sectionFromUrl ? Number(sectionFromUrl) : null
  );
  const [selectedMachineId, setSelectedMachineId] = useState<number | null>(
    machineFromUrl ? Number(machineFromUrl) : null
  );

  const [newPartId, setNewPartId] = useState<number | null>(null);
  const [newPartQty, setNewPartQty] = useState<number>(1);

  const [editingPartId, setEditingPartId] = useState<number | null>(null);
    const [editedQty, setEditedQty] = useState<number>(0);
    const [editedReqQty, setEditedReqQty] = useState<number>(0);


  // Sync state with URL params
  useEffect(() => {
    const factoryFromUrl = searchParams.get("factory");
    const sectionFromUrl = searchParams.get("factorySection");
    const machineFromUrl = searchParams.get("machine");

    setSelectedFactoryId(factoryFromUrl ? Number(factoryFromUrl) : null);
    setSelectedFactorySectionId(sectionFromUrl ? Number(sectionFromUrl) : null);
    setSelectedMachineId(machineFromUrl ? Number(machineFromUrl) : null);
  }, [searchParams]);

  // Load Factories
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

  // Load Factory Sections when Factory is selected
  useEffect(() => {
    if (selectedFactoryId !== null) {
      const loadSections = async () => {
        try {
          const data = await fetchFactorySections(selectedFactoryId);
          setFactorySections(data);
        } catch (error) {
          toast.error("Failed to load factory sections.");
        }
      };
      loadSections();

      setMachineParts([]);
    } else {
      setFactorySections([]);
    }
  }, [selectedFactoryId]);
  

  // Load Machines when Factory Section is selected
  useEffect(() => {
    console.log("Sect",selectedFactorySectionId)
    if (selectedFactorySectionId !== null) {
      const loadMachines = async () => {
        try {
          const data = await fetchAllMachines(selectedFactorySectionId);
          setMachines(data);
        } catch (error) {
          toast.error("Failed to load machines.");
        }
      };
      loadMachines();
      setMachineParts([]);
    } else {
      setMachines([]);
    }
  }, [selectedFactorySectionId]);

  // Load Machine Parts when Machine is selected
  useEffect(() => {
    if (selectedMachineId !== null) {
      const loadMachineParts = async () => {
        try {
          const data = await fetchMachineParts(selectedMachineId);
          setMachineParts(data);
        } catch (error) {
          toast.error("Failed to load machine parts.");
        }
      };
      loadMachineParts();
    } else {
      setMachineParts([]);
    }
  }, [selectedMachineId]);

  // Handle Factory selection
  const handleFactoryChange = (value: string) => {
    const newFactoryId = Number(value);
    setSelectedFactoryId(newFactoryId);
    setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      updatedParams.set("factory", newFactoryId.toString());
      updatedParams.delete("factorySection");
      updatedParams.delete("machine");
      return updatedParams;
    });
  };

  // Handle Factory Section selection
  const handleFactorySectionChange = (value: string) => {
    const newFactorySectionId = Number(value);
    setSelectedFactorySectionId(newFactorySectionId);
    setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      updatedParams.set("factorySection", newFactorySectionId.toString());
      updatedParams.delete("machine");
      return updatedParams;
    });
  };

  // Handle Machine selection
  const handleMachineChange = (value: string) => {
    const newMachineId = Number(value);
    setSelectedMachineId(newMachineId);
    setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      updatedParams.set("machine", newMachineId.toString());
      return updatedParams;
    });
  };

  // Add or update machine part
  const handleAddMachinePart = async () => {
    if (newPartId === null || selectedMachineId === null || newPartQty < 1) {
      toast.error("Select a machine and enter a valid quantity.");
      return;
    }

    try {
      await upsertMachineParts(newPartId, selectedMachineId, newPartQty);
      toast.success("Machine part added/updated successfully!");
      setNewPartId(null);
      setNewPartQty(1);
      if (selectedMachineId) {
        const updatedParts = await fetchMachineParts(selectedMachineId);
        setMachineParts(updatedParts);
      }
    } catch (error) {
      toast.error("Error adding/updating machine part.");
    }
  };

  // Delete Machine Part
  const handleDeleteMachinePart = async (partId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this machine part?");
    if (!confirmed) return;

    try {
      const success = await deleteMachinePart(partId);
      if (success && selectedMachineId) {
        const updatedParts = await fetchMachineParts(selectedMachineId);
        setMachineParts(updatedParts);
      }
    } catch (error) {
      toast.error("Failed to delete machine part.");
    }
  };

  const startEditing = (part: MachinePart) => {
    setEditingPartId(part.id);
    setEditedQty(part.qty);
    setEditedReqQty(part.req_qty ?? -1); // Default to 0 if null
};
  
  const handleUpdatePart = async (partId: number, machineId: number) => {
    try {
      await upsertMachineParts(partId, machineId, editedQty);
      toast.success("Machine part updated successfully!");
      setEditingPartId(null);
  
      // Refresh Machine Parts
      if (selectedMachineId) {
        const updatedParts = await fetchMachineParts(selectedMachineId);
        setMachineParts(updatedParts);
      }
    } catch (error) {
      toast.error("Error updating machine part.");
    }
  };

  const handleUpdateMachineParts = async (part: MachinePart) => {
    if (!part || !selectedMachineId) {
      toast.error("Invalid machine or part selection.");
      return;
    }
  
    // Ensure we use the edited values, but fallback to existing part values if empty
    const updatedQty = editedQty !== null ? editedQty : part.qty;
    const updatedReqQty = editedReqQty !== null ? editedReqQty : part.req_qty;
  
    try {
        console.log(part.id, updatedQty, updatedReqQty?updatedReqQty:-1)
      await updateMachinePartQuantities(part.id, updatedQty, updatedReqQty?updatedReqQty:-1);
  
  
      // Reset edit state
      setEditingPartId(null);
      setEditedQty(0);
      setEditedReqQty(0);
  
      // Refresh machine parts list
      const updatedParts = await fetchMachineParts(selectedMachineId);
      setMachineParts(updatedParts);
    } catch (error) {
      toast.error("Error updating machine part.");
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
                <SelectValue>
                    {selectedFactoryId
                    ? factories.find((f) => f.id === selectedFactoryId)?.name
                    : "Select Factory"}
                </SelectValue>
                </SelectTrigger>
                <SelectContent>
                {factories.length > 0 ? (
                    factories.map((factory) => (
                    <SelectItem key={factory.id} value={factory.id.toString()}>
                        {factory.name}
                    </SelectItem>
                    ))
                ) : (
                    <div className="text-gray-500 p-2">No Factories Available</div>
                )}
                </SelectContent>
            </Select>
            </div>

            {/* Select Factory Section (Only show if a factory is selected) */}
            {selectedFactoryId && (
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Select Factory Section</label>
                <Select value={selectedFactorySectionId?.toString() || ""} onValueChange={handleFactorySectionChange}>

                <SelectTrigger className="w-full">
                    <SelectValue>
                    {selectedFactorySectionId
                        ? factorySections.find((s) => s.id === selectedFactorySectionId)?.name
                        : "Select Section"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {factorySections.length > 0 ? (
                    factorySections.map((section) => (
                        <SelectItem key={section.id} value={section.id.toString()}>
                        {section.name}
                        </SelectItem>
                    ))
                    ) : (
                    <div className="text-gray-500 p-2">No Sections Available</div>
                    )}
                </SelectContent>
                </Select>
            </div>
            )}

            {/* Select Machine (Only show if a factory section is selected) */}
            {selectedFactorySectionId && (
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Select Machine</label>
                <Select value={selectedMachineId?.toString() || ""} onValueChange={handleMachineChange}>

                <SelectTrigger className="w-full">
                    <SelectValue>
                    {selectedMachineId
                        ? machines.find((m) => m.id === selectedMachineId)?.name
                        : "Select Machine"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                <SelectContent>
                    {machines
                        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
                        .map((machine) => (
                        <SelectItem key={machine.id} value={machine.id.toString()}>
                            {machine.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                   
                </SelectContent>
                </Select>
            </div>
            )}


        {/* Machine Parts Table */}
        {selectedMachineId && (
        <div className="max-h-64 overflow-y-auto border rounded-md shadow-sm">

            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Part ID</TableHead>
                <TableHead>Part Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Req Qty</TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
  {machineParts.map((part) => (
    <TableRow key={part.id}>
      <TableCell>{part.parts.id}</TableCell>
        <TableCell>
        <Link to={`/viewpart/${part.parts.id}`} className="text-blue-600 hover:underline">
            {part.parts.name}
        </Link>
        </TableCell>
      {/* Editable Quantity Fields (Within the Same Row) */}
      <TableCell>
        {editingPartId === part.id ? (
          <Input
            type="number"
            value={editedQty ?? part.qty}
            onChange={(e) => setEditedQty(Number(e.target.value))}
            className="border rounded-md p-1 w-16 text-center"
          />
        ) : (
          part.qty
        )}
      </TableCell>
      <TableCell>
        {editingPartId === part.id ? (
          <Input
            type="number"
            value={editedReqQty ?? part.req_qty}
            onChange={(e) => setEditedReqQty(Number(e.target.value))}
            className="border rounded-md p-1 w-16 text-center"
          />
        ) : (
          part.req_qty
        )}
      </TableCell>

      {/* Actions (Buttons Change Without Creating a New Row) */}
      <TableCell className="flex gap-2">
        {editingPartId === part.id ? (
          <>
            {/* Confirm Edit Button */}
            <button
              onClick={() => handleUpdateMachineParts(part)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 rounded-md border border-blue-600 hover:bg-blue-100 transition"
            >
              <Check size={18} />
            </button>

            {/* Cancel Edit Button */}
            <button
              onClick={() => setEditingPartId(null)}
              className="text-red-600 hover:text-red-800 flex items-center gap-1 px-2 py-1 rounded-md border border-red-600 hover:bg-red-100 transition"
            >
              <PencilOff size={18} />
            </button>
          </>
        ) : (
          <>
            {/* Edit Button */}
            <button
              onClick={() => startEditing(part)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 rounded-md border border-blue-600 hover:bg-blue-100 transition"
            >
              <PencilRuler size={18} />
            </button>

            {/* Delete Button (Only visible when NOT editing) */}
            <button
              onClick={() => handleDeleteMachinePart(part.id)}
              className="text-red-600 hover:text-red-800 flex items-center gap-1 px-2 py-1 rounded-md border border-red-600 hover:bg-red-100 transition"
            >
              <XCircle size={18} />
            </button>
          </>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

            </Table>
        </div>
        )}
      </div>
    </div>
  );
};

export default MachinePartsManagementCard;
