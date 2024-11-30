// AllMachinesStatus.tsx
import { useEffect, useState } from "react";
import { fetchFactories, fetchAllFactorySections } from "@/services/FactoriesService";
import { fetchAllMachines, fetchAllMachinesEnriched, fetchEnrichedMachines } from "@/services/MachineServices";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

interface Factory {
    id: number;
    name: string;
}

interface FactorySection {
    id: number;
    name: string;
    factory_id: number;
}

interface Machine {
    id: number;
    name: string;
    is_running: boolean;
    factory: string;
    factory_section_id: number;
}

const AllMachinesStatus = () => {
    const [factories, setFactories] = useState<Factory[]>([]);
    const [factorySections, setFactorySections] = useState<FactorySection[]>([]);
    const [machines, setMachines] = useState<Machine[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const fetchedFactories = await fetchFactories();
                const fetchedSections = await fetchAllFactorySections();
                const { data: enrichedMachines } = await fetchAllMachinesEnriched();

                setFactories(fetchedFactories);
                setFactorySections(fetchedSections);
                setMachines(enrichedMachines);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin mr-2" />
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <Accordion type="multiple" className="w-full">
            {factories.map((factory) => {
                const factorySectionsForFactory = factorySections.filter(
                    (section) => section.factory_id === factory.id
                );

                return (
                    <AccordionItem key={factory.id} value={`factory-${factory.id}`}>
                        <AccordionTrigger>
                            <CardTitle>{factory.name}</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent>
                            {factorySectionsForFactory.map((section) => {
                                const sectionMachines = machines
                                    .filter((machine) => machine.factory_section_id === section.id)
                                    .sort((a, b) =>
                                        a.name.localeCompare(b.name, undefined, {
                                            numeric: true,
                                            sensitivity: "base",
                                        })
                                    );

                                const runningCount = sectionMachines.filter((m) => m.is_running).length;

                                return (
                                    <AccordionItem
                                        key={section.id}
                                        value={`section-${section.id}`}
                                        className="pl-4"
                                    >
                                        <AccordionTrigger>
                                            {section.name} - {runningCount}/{sectionMachines.length} Running
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-wrap gap-2">
                                                {sectionMachines.map((machine, index) => (
                                                    <span key={machine.id} className="inline-flex items-center">
                                                        <Badge
                                                            variant="secondary"
                                                            className={`text-sm ${machine.is_running
                                                                    ? "bg-green-100 text-green-600"
                                                                    : "bg-red-100 text-red-600"
                                                                }`}
                                                        >
                                                            {machine.name}
                                                        </Badge>
                                                        {index < sectionMachines.length - 1 && <span>,</span>}
                                                    </span>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>

    );
};
export default AllMachinesStatus;