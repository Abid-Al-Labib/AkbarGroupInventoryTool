import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import NavigationBar from "@/components/customui/NavigationBar";
import toast from 'react-hot-toast';
import OrdersTableRow from '@/components/customui/OrdersTableRow';
import { Order } from '@/types';
import { fetchOrders } from '@/services/OrdersService';
import SearchAndFilter from '@/components/customui/SearchAndFilter'; // Import the new component
import { useAuth } from '@/context/AuthContext';
import { supabase_client } from '@/services/SupabaseClient';
import { Switch } from '@/components/ui/switch';
import { Label } from '@radix-ui/react-dropdown-menu';


const OrderPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [ordersPerPage] = useState(20); // Set the number of orders per page here
    const [count, setCount] = useState(0);
    const [filters, setFilters] = useState<any>({});
    const [filterSummary, setFilterSummary] = useState<string>(''); // New state for summary
    const [showCompleted, setShowCompleted] = useState<boolean>(false)
    const profile = useAuth().profile

    const handleApplyFilters = (newFilters: any, summary: string) => { // Receive the summary
        // console.log('Applied Filters:', newFilters);
        setFilters(newFilters);
        setFilterSummary(summary); // Store the filter summary
        setCurrentPage(1); // Reset page to 1 when filters are applied
        fetchOrdersforPage(newFilters, 1);
    };

    const fetchOrdersforPage = async (appliedFilters = filters, page = currentPage) => {
        
        try {
            setLoading(true);
            const { data, count } = await fetchOrders({
                page,
                limit: ordersPerPage,
                showCompleted: showCompleted,
                query: appliedFilters.searchType === 'id' ? appliedFilters.searchQuery : '',
                reqNum: appliedFilters.reqNumQuery,
                searchDate: appliedFilters.selectedDate,
                dateFilterType: appliedFilters.dateFilterType,
                statusId: appliedFilters.selectedStatusId !== -1 ? appliedFilters.selectedStatusId : undefined,
                departmentId: appliedFilters.selectedDepartmentId !== -1 ? appliedFilters.selectedDepartmentId : undefined,
                factoryId: appliedFilters.selectedFactoryId !== -1 ? appliedFilters.selectedFactoryId : undefined,
                factorySectionId: appliedFilters.selectedFactorySectionId !== -1 ? appliedFilters.selectedFactorySectionId : undefined,
                machineId: appliedFilters.selectedMachineId !== -1 ? appliedFilters.selectedMachineId : undefined,
                orderType: appliedFilters.selectedOrderType,
            
            });
            
            setOrders(data);
            setCount(count ?? 0);
            setTotalPages(Math.ceil((count ?? 0) / ordersPerPage));
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilters = () => {
        // console.log("Resseting filters by the function")
        setCurrentPage(1);
        setFilters({});
        fetchOrdersforPage({}); 
    };



    useEffect(() => {
        const channel = supabase_client
        .channel('order-changes')
        .on(
            'postgres_changes',
            {
            event: '*',
            schema: 'public',
            table: 'orders'
            },
            () => {
                console.log("Changes detected, processing realtime")
                fetchOrdersforPage();
            }
        )
        .subscribe()
        fetchOrdersforPage(filters, currentPage);
        
    }, [currentPage,showCompleted]);

    return (
        <>
            <NavigationBar />
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                        <Tabs defaultValue="all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 w-full">
                                    {/* Search & Filter Button */}
                                    <SearchAndFilter
                                        filterConfig={[
                                            { type: 'factory', label: 'Factory' },
                                            { type: 'factorySection', label: 'Factory Section' },
                                            { type: 'machine', label: 'Machine' },
                                            { type: 'department', label: 'Department' },
                                            { type: 'status', label: 'Status' },
                                            { type: 'id', label: 'Enter ID' },
                                            { type: 'date', label: 'Select Date' },
                                            { type: 'orderType', label: 'Select Order Type' },
                                        ]}
                                        onApplyFilters={handleApplyFilters}
                                        onResetFilters={handleResetFilters}
                                    />

                                    

                                    {/* Filter Summary */}
                                    <span className="text-gray-500 text-ss max-w-[150px] md:max-w-[300px] lg:max-w-[400px] truncate overflow-hidden ml-4">
                                        {filterSummary}
                                    </span>

                                    <div className="items-top flex space-x-2">
                                        <Switch
                                            checked={showCompleted}
                                            onCheckedChange={() => { setShowCompleted(!showCompleted), setCurrentPage(1) }}
                                        />
                                        <Label>Show Completed Orders</Label>
                                    </div>
                                </div>

                                {/* Create Order Button - Positioned on the right */}
                                { (profile?.permission==='department' || profile?.permission==="admin" || profile?.permission==='finance') &&
                                    <Link to="/createorder">
                                        <Button size="sm" className="h-8 gap-1 bg-blue-950">
                                            <PlusCircle className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                Create New Order
                                            </span>
                                        </Button>
                                    </Link>
                                }
                            </div>
                            <TabsContent value="all">
                                <Card x-chunk="dashboard-06-chunk-0">
                                    <CardHeader>
                                        <CardTitle>Order List</CardTitle>
                                        <CardDescription>
                                            Search, view and manage your orders.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead className='hidden md:table-cell'>Req Num</TableHead>
                                                    <TableHead className="hidden md:table-cell">Order for Machine/Storage</TableHead>
                                                    <TableHead className="hidden md:table-cell">Created at</TableHead>
                                                    <TableHead className="hidden md:table-cell">Created by</TableHead>
                                                    <TableHead className="hidden md:table-cell">Department</TableHead>
                                                    <TableHead className="table-cell md:hidden">Info</TableHead>
                                                    <TableHead>Current status</TableHead>
                                                    <TableHead>
                                                        <span className="sr-only">Actions</span>
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            {loading ? (
                                                <div className='flex flex-row justify-center'>
                                                    <Loader2 className='h-8 w-8 animate-spin' />
                                                </div>
                                            ) : (
                                                <TableBody>
                                                    {orders.map(order => (
                                                        <OrdersTableRow
                                                            order={order}
                                                            onDeleteRefresh={() => handleApplyFilters({}, '')}
                                                        />
                                                    ))}
                                                </TableBody>
                                            )}
                                        </Table>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
                                            <span>
                                                Showing <strong>{(currentPage - 1) * ordersPerPage + 1}</strong> to <strong>{Math.min(currentPage * ordersPerPage, count)}</strong> of <strong>{count}</strong> Orders
                                            </span>

                                            <div className="flex gap-2 overflow-x-auto">
                                                {/* Pagination Buttons */}
                                                <Button
                                                    size="sm"
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Previous
                                                </Button>

                                                {/* First Page */}
                                                <Button
                                                    size="sm"
                                                    variant={currentPage === 1 ? 'default' : 'outline'}
                                                    onClick={() => setCurrentPage(1)}
                                                >
                                                    1
                                                </Button>

                                                {/* Ellipses if needed before the current page */}
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
                                                            onClick={() => setCurrentPage(page)}
                                                        >
                                                            {page}
                                                        </Button>
                                                    ))}

                                                {/* Ellipses if needed after the current page */}
                                                {currentPage < totalPages - 3 && <span className="mx-2">...</span>}

                                                {/* Last Page */}
                                                {totalPages > 1 && (
                                                    <Button
                                                        size="sm"
                                                        variant={currentPage === totalPages ? 'default' : 'outline'}
                                                        onClick={() => setCurrentPage(totalPages)}
                                                    >
                                                        {totalPages}
                                                    </Button>
                                                )}

                                                <Button
                                                    size="sm"
                                                    onClick={() => setCurrentPage(currentPage + 1)}
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
    );
}

export default OrderPage;
