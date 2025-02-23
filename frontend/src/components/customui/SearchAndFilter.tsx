import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  fetchFactories,
  fetchFactorySections,
  fetchDepartments,
} from "@/services/FactoriesService";
import { fetchAllMachines } from "@/services/MachineServices";
import { fetchStatuses } from "@/services/StatusesService";

interface FilterOption {
  type: string;
  label?: string | string[];  // Can be a single string or an array of labels
}

interface SearchAndFilterProps {
  filterConfig?: FilterOption[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filterConfig,
}) => {

  const shouldShowFilter = (type: string) => {
    return !filterConfig || filterConfig.some((filter) => filter.type === type);
  };

  const getFilterLabel = (type: string, index = 0): string => {
    const label = filterConfig?.find(filter => filter.type === type)?.label;
    if (Array.isArray(label)) {
      return label[index] ?? label[0]; // Return requested index, fallback to first index if undefined
    }
    return label ?? `Enter ${type}`; // If it's a string, return it; otherwise, use default
  };
  
  
  const [searchParams, setSearchParams] = useSearchParams();

  // States for filters and dropdowns
  const [searchType, setSearchType] = useState<"id" | "date">(
    (searchParams.get("searchType") as "id" | "date") || "id"
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [reqNumQuery, setReqNumQuery] = useState(searchParams.get("reqNum") || "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined
  );
  const [dateFilterType, setDateFilterType] = useState<number>(
    searchParams.get("dateFilterType") 
      ? Number(searchParams.get("dateFilterType")) 
      : 1
  );
  

  const [factories, setFactories] = useState<any[]>([]);
  const [factorySections, setFactorySections] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);

  // Dropdown states
  const [selectedFactoryId, setSelectedFactoryId] = useState<number>(
    searchParams.get("factory") ? Number(searchParams.get("factory")) : -1
  );
  const [selectedFactorySectionId, setSelectedFactorySectionId] = useState<number>(
    searchParams.get("section") ? Number(searchParams.get("section")) : -1
  );
  const [selectedMachineId, setSelectedMachineId] = useState<number>(
    searchParams.get("machine") ? Number(searchParams.get("machine")) : -1
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(
    searchParams.get("department") ? Number(searchParams.get("department")) : -1
  );
  const [selectedStatusId, setSelectedStatusId] = useState<number>(
    searchParams.get("status") ? Number(searchParams.get("status")) : -1
  );

  // Order Type State (Toggle between All, Machine, Storage)
  const [selectedOrderType, setSelectedOrderType] = useState<"all" | "Machine" | "Storage">(
    (searchParams.get("orderType") as "all" | "Machine" | "Storage") || "all"
  );

// State for Part ID & Part Name filters
  const [partIdQuery, setPartIdQuery] = useState<string>(searchParams.get("partId") || "");
  const [partNameQuery, setPartNameQuery] = useState<string>(searchParams.get("partName") || "");

  useEffect(() => {
    const fetchData = async () => {
      setFactories(await fetchFactories());
      setDepartments(await fetchDepartments());
      setStatuses(await fetchStatuses());
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedFactoryId !== -1) {
      const fetchSections = async () => {
        setFactorySections(await fetchFactorySections(selectedFactoryId));
        setSelectedFactorySectionId(-1); // Reset dependent selections
        setSelectedMachineId(-1);
      };
      fetchSections();
    } else {
      setFactorySections([]);
    }
  }, [selectedFactoryId]);

  useEffect(() => {
    if (selectedFactorySectionId !== -1) {
      const fetchMachinesData = async () => {
        setMachines((await fetchAllMachines(selectedFactorySectionId)).data);
        setSelectedMachineId(-1);
      };
      fetchMachinesData();
    } else {
      setMachines([]);
    }
  }, [selectedFactorySectionId]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (selectedFactoryId !== -1) params.set("factory", selectedFactoryId.toString());
    if (selectedFactorySectionId !== -1) params.set("section", selectedFactorySectionId.toString());
    if (selectedMachineId !== -1) params.set("machine", selectedMachineId.toString());
    if (selectedDepartmentId !== -1) params.set("department", selectedDepartmentId.toString());
    if (selectedStatusId !== -1) params.set("status", selectedStatusId.toString());
    params.set("searchType", searchType);
    if (searchQuery) params.set("query", searchQuery);
    if (reqNumQuery) params.set("reqNum", reqNumQuery);
    if (selectedOrderType !== "all") {
      params.set("orderType", selectedOrderType);
    }
    if (dateFilterType !== 1) {
      params.set("dateFilterType", dateFilterType.toString());
    }
    if (selectedDate) params.set("date", selectedDate.toISOString());

    if (partIdQuery) params.set("partId", partIdQuery);
    if (partNameQuery) params.set("partName", partNameQuery);

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setReqNumQuery("");
    setSelectedDate(undefined);
    setDateFilterType(1);
    setSelectedFactoryId(-1);
    setSelectedFactorySectionId(-1);
    setSelectedMachineId(-1);
    setSelectedDepartmentId(-1);
    setSelectedStatusId(-1);
    setSelectedOrderType("all");
    setSearchType("id");
    setPartIdQuery("");
    setPartNameQuery("");
  
    // ✅ Clear filters from URL
    setSearchParams(new URLSearchParams());
  
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default">Search & Filters</Button>
      </SheetTrigger>
      <SheetContent className="h-full overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>Search & Filter Orders</SheetTitle>
          <SheetDescription>Use the filters below to search for orders.</SheetDescription>
        </SheetHeader>
  
        <div className="grid gap-4 py-4 px-2">
          {/* Search by ID or Date */}
          {(shouldShowFilter("id") || shouldShowFilter("date")) && (
            <div className="flex gap-2">
              {shouldShowFilter("id") && (
                <Button variant={searchType === "id" ? "default" : "outline"} onClick={() => {setSearchType("id");setSelectedDate(undefined)}}>
                  Search by ID
                </Button>
              )}
              {shouldShowFilter("date") && (
                <Button variant={searchType === "date" ? "default" : "outline"} onClick={() => {setSearchType("date"); setSearchQuery(""); setReqNumQuery("")}}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Search by Date
                </Button>
              )}
            </div>
          )}

          {/* ID & Requisition Number */}
          {shouldShowFilter("id") && searchType === "id" && (
            <>
              <Input
                type="search"
                placeholder={getFilterLabel("id")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Input
                type="search"
                placeholder={getFilterLabel("id", 1)}
                value={reqNumQuery}
                onChange={(e) => setReqNumQuery(e.target.value)}
              />
            </>
          )}

          {/* Date Picker */}
          {shouldShowFilter("date") && searchType === "date" && (
            <div className="flex flex-col gap-2 mt-2">
              <Label className="mb-2">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                }}
                className="rounded-md border"
              />

              {/* Date Filter Buttons (On | Before | After) */}
              <div className="flex gap-2 mt-2">
                {[{ value: 1, label: "On" }, { value: 2, label: "Before" }, { value: 3, label: "After" }].map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={dateFilterType === value ? "default" : "outline"}
                    onClick={() => setDateFilterType(value as 1 | 2 | 3)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}


          {/* Factory Dropdown */}
          {shouldShowFilter("factory") && (
            <>
              <Label>Factory</Label>
              <Select value={selectedFactoryId.toString()} onValueChange={(value) => setSelectedFactoryId(Number(value))}>
                <SelectTrigger>
                  <SelectValue>{factories.find(f => f.id === selectedFactoryId)?.name || "Select Factory"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {factories.map(factory => (
                    <SelectItem key={factory.id} value={factory.id.toString()}>{factory.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
  
          {/* Factory Section Dropdown */}
          {shouldShowFilter("factorySection") && (
            <>
              <Label>Factory Section</Label>
              <Select value={selectedFactorySectionId.toString()} onValueChange={(value) => setSelectedFactorySectionId(Number(value))} disabled={selectedFactoryId === -1}>
                <SelectTrigger>
                  <SelectValue>{factorySections.find(fs => fs.id === selectedFactorySectionId)?.name || "Select Section"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {factorySections.map(section => (
                    <SelectItem key={section.id} value={section.id.toString()}>{section.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
  
          {/* Machine Dropdown */}
          {shouldShowFilter("machine") && (
            <>
              <Label>Machine</Label>
              <Select
                value={selectedMachineId.toString()}
                onValueChange={(value) => setSelectedMachineId(Number(value))}
                disabled={selectedFactorySectionId === -1}
              >
                <SelectTrigger>
                  <SelectValue>
                    {machines.find((m) => m.id === selectedMachineId)?.name || "Select Machine"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {machines
                    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })) // Sort alphabetically & numerically
                    .map((machine) => (
                      <SelectItem key={machine.id} value={machine.id.toString()}>
                        {machine.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </>
          )}

          {/* Department Dropdown */}
          {shouldShowFilter("department") && (
            <>
              <Label>Department</Label>
              <Select value={selectedDepartmentId.toString()} onValueChange={(value) => setSelectedDepartmentId(Number(value))}>
                <SelectTrigger>
                  <SelectValue>{departments.find(d => d.id === selectedDepartmentId)?.name || "Select Department"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {/* Status Dropdown */}
          {shouldShowFilter("status") && (
            <>
              <Label>Status</Label>
              <Select value={selectedStatusId.toString()} onValueChange={(value) => setSelectedStatusId(Number(value))}>
                <SelectTrigger>
                  <SelectValue>{statuses.find(s => s.id === selectedStatusId)?.name || "Select Status"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status.id} value={status.id.toString()}>{status.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
  
          {/* Order Type Toggle */}
          {shouldShowFilter("orderType") && (
          <>
            <Label>Order Type</Label>
            <div className="flex gap-2">
              <Button variant={selectedOrderType === "all" ? "default" : "outline"} onClick={() => setSelectedOrderType("all")}>
                All
              </Button>
              <Button variant={selectedOrderType === "Machine" ? "default" : "outline"} onClick={() => setSelectedOrderType("Machine")}>
                Machine
              </Button>
              <Button variant={selectedOrderType === "Storage" ? "default" : "outline"} onClick={() => setSelectedOrderType("Storage")}>
                Storage
              </Button>
            </div>
          </>
        )}
          {/* Only for PartsPage*/}
          {shouldShowFilter("partId") && (
            <Input
              type="search"
              placeholder={getFilterLabel("partId")}
              value={partIdQuery}
              onChange={(e) => setPartIdQuery(e.target.value)}
            />
          )}
          {shouldShowFilter("partName") && (
            <Input
              type="search"
              placeholder={getFilterLabel("partName")}
              value={partNameQuery}
              onChange={(e) => setPartNameQuery(e.target.value)}
            />
          )}

        </div>
  
        <SheetFooter className="flex justify-between">
          <Button onClick={handleResetFilters} type="button" variant="outline">
            Reset Filters
          </Button>
          <Button onClick={handleApplyFilters} type="submit" className="bg-blue-950 text-white">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};  
export default SearchAndFilter;
