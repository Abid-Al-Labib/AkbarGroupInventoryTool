import { useEffect, useState } from "react";
import { fetchFactories } from "@/services/FactoriesService";
import { fetchStorageParts, updateStoragePartQty } from "@/services/StorageService";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import StoragePartsTable from "@/components/customui/StoragePartsTable";
import NavigationBar from "@/components/customui/NavigationBar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { fetchAllParts } from "@/services/PartsService";
import { Part } from "@/types";
import ReactSelect from "react-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


type StoragePart = {
  storageId: number;
  id: number;
  name: string;
  description: string;
  qty: number;
  factory_name: string;
  factory_id: number;
};

const StoragePage = () => {
  const profile = useAuth().profile;
  const canManageStorage = profile?.permission === "admin" || profile?.permission === "finance";
  const [parts, setParts] = useState<StoragePart[]>([]);
  const [allParts, setAllParts] = useState<Part[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<number>(-1);
  const [manualQty, setManualQty] = useState<number | "">("");
  const [isAddPartDialogOpen, setIsAddPartDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [factories, setFactories] = useState<{ id: number; name: string }[]>([]);
  const [selectedFactoryId, setSelectedFactoryId] = useState<number | undefined>(undefined);

    useEffect(() => {
      // Fetch factories when the component mounts
      const loadFactories = async () => {
        try {
          const fetchedFactories = await fetchFactories();
          if (fetchedFactories.length > 0) {
            setFactories(fetchedFactories); // Set factories correctly here
          } else {
            toast.error("No factories found");
          }
        } catch (error) {
          toast.error("Failed to load factories");
        }
      };

      loadFactories();
    }, []);

  const loadParts = async () => {
    try {
      setLoading(true);
      const fetchedFactories = await fetchFactories();
      const factoryMap: { [key: number]: string } = {};
      fetchedFactories.forEach((factory: { id: number; name: string }) => {
        factoryMap[factory.id] = factory.name;
      });

      const fetchedParts = await fetchStorageParts(
        selectedFactoryId || -1,
        filters.partNameQuery || undefined,
        filters.partIdQuery || undefined
      );

      const processedParts = fetchedParts
        .map((record: any) => ({
          storageId: record.id,
          id: record.parts.id,
          name: record.parts.name,
          description: record.parts.description,
          qty: record.qty,
          factory_name: factoryMap[record.factory_id],
          factory_id: record.factory_id,
        }))
        .filter((part: StoragePart) => part.qty > 0);

      if (processedParts.length > 0) {
        setParts(processedParts);
      } else {
        setParts([]);
      }
    } catch (error) {
      toast.error("Failed to fetch parts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAllParts = async () => {
      try {
        const { data } = await fetchAllParts();
        setAllParts(data || []);
      } catch (error) {
        toast.error("Failed to load all parts");
      }
    };
    loadAllParts();
  }, []);

  useEffect(() => {
    loadParts();
  }, [selectedFactoryId, filters, factories]);

  const handleManualAdd = async () => {
    if (selectedFactoryId === undefined) {
      toast.error("Please select a factory first");
      return;
    }
    if (selectedPartId <= 0) {
      toast.error("Please select a part");
      return;
    }
    if (manualQty === "" || Number(manualQty) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    try {
      setLoading(true);
      console.group("[StoragePage] Manual add to storage");
      console.log("Attempt payload", {
        selectedFactoryId,
        selectedPartId,
        quantity: Number(manualQty),
        action: "add",
        selectedPart: allParts.find((p) => p.id === selectedPartId) || null,
      });
      await updateStoragePartQty(selectedPartId, selectedFactoryId, Number(manualQty), "add");
      console.log("updateStoragePartQty completed without throwing");
      toast.success("Part added to storage");
      setManualQty("");
      setSelectedPartId(-1);
      setIsAddPartDialogOpen(false);
      await loadParts();
    } catch (error) {
      console.error("[StoragePage] Failed to add part to storage", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to add part to storage: ${errorMessage}`);
    } finally {
      console.groupEnd();
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-row justify-center p-5">
        <Loader2 className="animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <main className="p-4 sm:px-6 sm:py-0 mt-2">
          {/* Factory Selection Dropdown */}
          <div className="mb-4">
            <Label className="mb-2">Select Factory</Label>
            <Select
              value={selectedFactoryId === undefined ? "" : selectedFactoryId.toString()}
              onValueChange={(value) => setSelectedFactoryId(value === "" ? undefined : Number(value))}
            >
              <SelectTrigger className="w-[220px] mt-2">
                <SelectValue>
                  {selectedFactoryId === undefined ? "Select a Factory" : factories.find(f => f.id === selectedFactoryId)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {factories.map(factory => (
                  <SelectItem key={factory.id} value={factory.id.toString()}>
                    {factory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFactoryId === undefined ? (
             <div className="text-center text-lg">Please select a factory to display data</div>
          ) : (
            <StoragePartsTable
              parts={parts}
              onApplyFilters={setFilters}
              onResetFilters={() => setFilters({})}
              canManage={canManageStorage}
              onPartUpdated={loadParts}
              onOpenAddDialog={() => setIsAddPartDialogOpen(true)}
            />
          )}
        </main>
      </div>

      <Dialog open={isAddPartDialogOpen} onOpenChange={setIsAddPartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Part to Storage</DialogTitle>
            <DialogDescription>
              Select a part and quantity to add to the selected factory storage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-red-600">
              Warning: this is a manual storage update and will not be tracked in the automated order flow.
            </div>
            <div>
              <Label htmlFor="manual-part-select">Select Part</Label>
              <ReactSelect
                inputId="manual-part-select"
                options={allParts
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((part) => ({
                    value: part.id,
                    label: `${part.name} (${part.unit || "units"})`,
                  }))}
                onChange={(selectedOption) => setSelectedPartId(Number(selectedOption?.value ?? -1))}
                isSearchable
                placeholder="Search or Select a Part"
                value={selectedPartId > 0 ? {
                  value: selectedPartId,
                  label: (() => {
                    const selectedPart = allParts.find((p) => p.id === selectedPartId);
                    return selectedPart ? `${selectedPart.name} (${selectedPart.unit || "units"})` : "";
                  })(),
                } : null}
              />
            </div>
            <div>
              <Label htmlFor="manual-add-qty">Quantity</Label>
              <input
                id="manual-add-qty"
                type="number"
                min={1}
                value={manualQty}
                onChange={(e) => setManualQty(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Enter quantity"
                className="input input-bordered w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleManualAdd} className="bg-blue-700 hover:bg-blue-800">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};


export default StoragePage;