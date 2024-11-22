import { useEffect, useState } from "react";
import { fetchFactories } from "@/services/FactoriesService";
import { fetchStorageParts } from "@/services/StorageService";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import StoragePartsTable from "@/components/customui/StoragePartsTable";
import NavigationBar from "@/components/customui/NavigationBar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";


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
  const [parts, setParts] = useState<StoragePart[]>([]);
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

  useEffect(() => {
    const loadParts = async () => {
      try {
        const factories = await fetchFactories();
        const factoryMap: { [key: number]: string } = {};
        factories.forEach((factory: { id: number; name: string }) => {
          factoryMap[factory.id] = factory.name;
        });

        const fetchedParts = await fetchStorageParts(
          selectedFactoryId || -1,
          filters.partNameQuery || undefined,
          filters.partIdQuery || undefined
        );

        const processedParts = fetchedParts.map((record: any) => ({
          storageId: record.id,
          id: record.parts.id,
          name: record.parts.name,
          description: record.parts.description,
          qty: record.qty,
          factory_name: factoryMap[record.factory_id],
          factory_id: record.factory_id,
        }));

        if (processedParts.length > 0) {
          setParts(processedParts);
        } else {
          setParts([]); // Clear parts if no parts are found for the selected factory
        }
      } catch (error) {
        toast.error("Failed to fetch parts");
      } finally {
        setLoading(false); // Stop loading after fetching is complete
      }
    };

    loadParts();
  }, [selectedFactoryId, filters, factories]);
  
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
            />
          )}
        </main>
      </div>
    </>
  );
};


export default StoragePage;