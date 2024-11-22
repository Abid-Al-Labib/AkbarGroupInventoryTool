import { useEffect, useState } from 'react';
import { fetchPageParts } from '../services/PartsService';
import { useNavigate } from "react-router-dom"
import { Loader2, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import { Tabs, TabsContent,} from "@/components/ui/tabs"
import PartsTableRow from "@/components/customui/PartsTableRow"
import NavigationBar from "@/components/customui/NavigationBar"
import { Part } from '@/types';
import toast from 'react-hot-toast';
import { convertUtcToBDTime } from '@/services/helper';
import SearchAndFilter from "@/components/customui/SearchAndFilter"; // Import the SearchAndFilter component
import { fetchAppSettings } from '@/services/AppSettingsService';



const PartsPage = () => {
    
    const [parts,setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<any>({});
    const [currentPage, setCurrentPage] = useState(1);   // Track current page
    const [totalPages, setTotalPages] = useState(1);     // Track total pages
    const [partsPerPage] = useState(20);                 // Set number of parts per page
    const [totalCount, setTotalCount] = useState(0);     // Track total number of parts
    const [addPartEnabled, setaddPartEnabled] = useState<boolean>(false)
    const navigate = useNavigate()
    
    const handleApplyFilters = (newFilters: any) => {
        setFilters(newFilters);
        setCurrentPage(1);  // Reset page to 1 when filters are applied
        fetchPartsForPage(newFilters, 1);  // Fetch parts with the new filters
    };

    const fetchPartsForPage = async (appliedFilters = filters, page = currentPage) => {
        try {
            setLoading(true);
            const { data: fetchedParts, count } = await fetchPageParts(
                appliedFilters.partIdQuery || undefined,
                appliedFilters.partNameQuery || undefined,
                page,
                partsPerPage
            );
            setParts(fetchedParts);
            setTotalCount(count ?? 0);  // Set total count of parts
            setTotalPages(Math.ceil((count ?? 0) / partsPerPage));  // Calculate total pages
        } catch (error) {
            toast.error("Failed to fetch parts");
        } finally {
            setLoading(false);
        }
    };
    // Handle Page Change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);  // Update current page
    };

    const handleResetFilters = () => {
        setCurrentPage(1); // Reset page to 1
        setFilters({});
        fetchPartsForPage({}, 1);  // Fetch parts without filters
    };

    useEffect(() => {
        fetchPartsForPage(filters, currentPage);  // Re-fetch parts when the page changes
    }, [currentPage]);

    useEffect(() => {
        const loadAddPartSettings = async () => {
            try {
                const settings_data = await fetchAppSettings()
                if (settings_data) {
                    settings_data.forEach((setting) => {
                        if (setting.name === "Add Part") {
                            setaddPartEnabled(setting.enabled)
                        }
                    })
                }
            } catch (error) {
                toast.error("Could not load settings data")
                setaddPartEnabled(false)
            }
        }
        loadAddPartSettings();
    }, []);

    
    const handleAddPartButtonClick = () => {
        navigate("/addpart")
    }

    return (
        <>
        <NavigationBar/>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <Tabs defaultValue="all">

                    <div className="flex items-center justify-between">
                        {/* Left-aligned Search & Filter Button */}
                        <div className="flex items-center">
                            <SearchAndFilter
                                filterConfig={[
                                    { type: 'partId', label: 'Enter Part ID' },
                                    { type: 'partName', label: 'Enter Part Name' },
                                ]}
                                onApplyFilters={handleApplyFilters}
                                onResetFilters={handleResetFilters}
                                hideDefaultIdDateSearch={true} // Hides default ID/Date search if not needed
                            />
                        </div>

                        {/* Right-aligned Add Part Button */}
                        <div>
                            <Button onClick={handleAddPartButtonClick} className="bg-blue-950" disabled={!addPartEnabled}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add Part
                            </span>
                            </Button>
                        </div>
                    </div>
                    <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Parts</CardTitle>
                            <CardDescription>
                                Manage parts and view information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">unit</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                    Created at
                                    </TableHead>
                                    <TableHead>
                                    <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                                </TableHeader>
                                {loading? (
                                    <div className='flex flex-row justify-center'>
                                        <Loader2 className='h-8 w-8 animate-spin'/>
                                    </div>
                                ):
                                    <TableBody>
                                    {parts.map(part => (
                                        <PartsTableRow key={part.id}
                                        id={part.id}
                                        name={part.name}
                                        unit={part.unit}
                                        created_at={convertUtcToBDTime(part.created_at)}                 
                                        />
                                    ))}
                                    </TableBody>
                                }  
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
                                <span>
                                    Showing <strong>{(currentPage - 1) * partsPerPage + 1}</strong> to <strong>{Math.min(currentPage * partsPerPage, totalCount)}</strong> of <strong>{totalCount}</strong> Parts
                                </span>

                                {/* Pagination */}
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>

                                    {/* First Page */}
                                    <Button
                                        size="sm"
                                        variant={currentPage === 1 ? 'default' : 'outline'}
                                        onClick={() => handlePageChange(1)}
                                    >
                                        1
                                    </Button>

                                    {/* Ellipses before the current page */}
                                    {currentPage > 4 && <span className="mx-2">...</span>}

                                    {/* Pages around the current page (2 before and 2 after) */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(page =>
                                            page >= currentPage - 2 && page <= currentPage + 2 && page !== 1 && page !== totalPages
                                        )
                                        .map((page) => (
                                            <Button
                                                key={page}
                                                size="sm"
                                                variant={currentPage === page ? 'default' : 'outline'}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </Button>
                                        ))}

                                    {/* Ellipses after the current page */}
                                    {currentPage < totalPages - 3 && <span className="mx-2">...</span>}

                                    {/* Last Page */}
                                    {totalPages > 1 && (
                                        <Button
                                            size="sm"
                                            variant={currentPage === totalPages ? 'default' : 'outline'}
                                            onClick={() => handlePageChange(totalPages)}
                                        >
                                            {totalPages}
                                        </Button>
                                    )}

                                    <Button
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                    </TabsContent>
                </Tabs>
                </main>
            </div>
        </div>
        </>
      )
}
export default PartsPage
