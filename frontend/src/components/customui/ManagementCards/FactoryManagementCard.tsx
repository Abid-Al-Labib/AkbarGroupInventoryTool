import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { fetchFactories, addFactory, editFactory } from "@/services/FactoriesService";
import { Factory } from "@/types";
import { Pencil, Trash2, Factory as FactoryIcon } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";


const FactoryManagementCard = () => {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [newFactoryName, setNewFactoryName] = useState("");
  const [newFactoryAbbreviation, setNewFactoryAbbreviation] = useState("");
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedAbbreviation, setEditedAbbreviation] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadFactories = async () => {
      const fetchedFactories = await fetchFactories();
      setFactories(fetchedFactories);
    };
    loadFactories();
  }, []);

  const handleAddFactory = async () => {
    if (!newFactoryName.trim() || !newFactoryAbbreviation.trim()) return;
    try {
      await addFactory(newFactoryName, newFactoryAbbreviation);
      toast.success("Factory added successfully");
      setNewFactoryName("");
      setNewFactoryAbbreviation("");
      setIsAdding(false);
      const updatedFactories = await fetchFactories();
      setFactories(updatedFactories);
    } catch (error) {
      toast.error("Failed to add factory");
    }
  };

  const handleEditFactory = async (factoryId: number) => {
    if (!editedName.trim() || !editedAbbreviation.trim()) return;
    try {
      await editFactory(factoryId, editedName, editedAbbreviation);
      toast.success("Factory updated successfully");
      setFactories(
        factories.map((factory) =>
          factory.id === factoryId ? { ...factory, name: editedName, abbreviation: editedAbbreviation } : factory
        )
      );
      setEditMode(null);
    } catch (error) {
      toast.error("Failed to update factory");
    }
  };

  return (
    <div className="w-full max-w-2xl p-2">
      <div className="max-h-[calc(100vh-100px)] overflow-y-auto p-4">
      <div className="space-y-4">
        {/* Add Factory Button (Expands on Click) */}
        <div className="rounded-lg p-4 shadow-sm">
        <AnimatePresence mode="wait">
            {!isAdding ? (
                <motion.div
                key="add-button"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.1 }}
                >
                <Button className="w-full" onClick={() => setIsAdding(true)}>
                    Add Factory
                </Button>
                </motion.div>
            ) : (
                <motion.div
                key="add-form"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.1 }}
                className="flex flex-col gap-2"
                >
                {/* The inputs after clicking Add Factory */}
                <div className="flex gap-2">
                    <Input
                    className="flex-grow"
                    placeholder="Enter factory name"
                    value={newFactoryName}
                    onChange={(e) => setNewFactoryName(e.target.value)}
                    />
                    <Input
                    className="w-32"
                    placeholder="Abbreviation"
                    value={newFactoryAbbreviation}
                    onChange={(e) => setNewFactoryAbbreviation(e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setIsAdding(false)}>
                    Cancel
                    </Button>
                    <Button onClick={handleAddFactory}>Add</Button>
                </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>

        {/* Factory List Table */}
        <div className="border rounded-lg shadow-sm overflow-x-auto">
          <div className="max-h-80 overflow-y-auto"> {/* Scrollable Table */}
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Abrv.</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {factories.map((factory) => (
                    <TableRow key={factory.id} className="hover:bg-gray-100">
                        {editMode === factory.id ? (
                        <TableCell colSpan={4} className="p-2">
                            <div className="flex flex-col gap-2 w-full">
                            <div className="flex gap-2 w-full">
                                <Input className="flex-grow" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                                <Input className="w-32" value={editedAbbreviation} onChange={(e) => setEditedAbbreviation(e.target.value)} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" onClick={() => setEditMode(null)}>Cancel</Button>
                                <Button size="sm" onClick={() => handleEditFactory(factory.id)}>Save</Button>
                            </div>
                            </div>
                        </TableCell>
                        ) : (
                        <>
                            <TableCell className="w-1/6">{factory.id}</TableCell>
                            <TableCell className="w-3/6">{factory.name}</TableCell>
                            <TableCell className="w-1/6">{factory.abbreviation}</TableCell>
                            <TableCell className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setEditMode(factory.id); setEditedName(factory.name); setEditedAbbreviation(factory.abbreviation); }}>
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            </TableCell>
                        </>
                        )}
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FactoryManagementCard;
