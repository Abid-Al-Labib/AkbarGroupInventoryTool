import NavigationBar from "@/components/customui/NavigationBar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/context/AuthContext'; 
import { fetchMetricNotRunningMachines, fetchMetricRunningMachines } from "@/services/MachineServices";
import { fetchMetricMostFrequentOrderedParts, fetchMetricMostFrequentOrderedPartsCurrentMonth } from "@/services/OrderedPartsService";
import { fetchManagableOrders, fetchMetricActiveOrders, fetchMetricsHighMaintenanceFactorySections, fetchMetricsHighMaintenanceFactorySectionsCurrentMonth } from "@/services/OrdersService";
import { Part } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const HomePage = () => {
  const profile = useAuth().profile
  const [loadingMetricRunningMachines, setLoadingMetricRunningMachines] = useState<boolean>(false)
  const [loadingMetricNotRunningMachines, setLoadingMetricNotRunningMachines] = useState<boolean>(false)
  const [loadingMetricManagableOrders, setLoadingMetricManagableOrders] = useState<boolean>(false)
  const [loadingMetricActiveOrders, setLoadingMetricActiveOrders] = useState<boolean>(false)
  const [loadingMetricMostFrequentOrderedParts, setLoadingMetricMostFrequentOrderedParts] = useState<boolean>(false)
  const [loadingMetricMostFrequentOrderedPartsCurrentMonth, setLoadingMetricMostFrequentOrderedPartsCurrentMonth] = useState<boolean>(false)
  const [loadingMetricHighMaintenanceFactorySections, setLoadingMetricHighMaintenanceFactorySections] = useState<boolean>(false)
  const [loadingMetricHighMaintenanceFactorySectionsCurrentMonth, setLoadingMetricHighMaintenanceFactorySectionsCurrentMonth] = useState<boolean>(false)
  
  const [numberOfMachinesRunning, setNumberOfMachinesRunning] = useState<number|null>(null)
  const [numberOfMachinesNotRunning, setNumberOfMachinesNotRunning] = useState<number|null>(null)
  const [numberOfManagableOrders, setNumberOfManagableOrders] = useState<number|null>(null)
  const [numberOfActiveOrders, setNumberOfActiveOrders] = useState<number|null>(null)
  const [mostFrequentOrderedParts, setMostFrequentOrderedParts] = useState<Part[]|null>(null)
  const [mostFrequentOrderedPartsCurrentMonth, setMostFrequentOrderedPartsCurrentMonth] = useState<Part[]|null>(null)
  const [highMaintenanceFactorySections, setHighMaintenanceFactorySections] = useState<string[]|null>(null)
  const [highMaintenanceFactorySectionsCurrentMonth, setHighMaintenanceFactorySectionsCurrentMonth] = useState<string[]|null>(null)

  const loadMetricRunningMachines = async () => {
    setLoadingMetricRunningMachines(true);
    try {
      const runningMachines = await fetchMetricRunningMachines()
      setNumberOfMachinesRunning(runningMachines);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMetricRunningMachines(false);
    }
  };


  const loadMetricNotRunningMachines = async () => {
    setLoadingMetricNotRunningMachines(true);
    try {
      const notRunningMachines = await fetchMetricNotRunningMachines()
      setNumberOfMachinesNotRunning(notRunningMachines);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMetricNotRunningMachines(false);
    }
  };

  const loadMetricManagableOrders = async () => {
    setLoadingMetricManagableOrders(true);
    try {
      if (profile)
      { 
        const managableOrders = await fetchManagableOrders(profile.permission)
        setNumberOfManagableOrders(managableOrders);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMetricManagableOrders(false);
    }
  };

  const loadMetricActiveOrders = async () => {
    setLoadingMetricActiveOrders(true);
    try {
      const runningOrders = await fetchMetricActiveOrders()
      setNumberOfActiveOrders(runningOrders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMetricActiveOrders(false);
    }
  };

  const loadMetricMostFrequentOrderedParts =  async () => {
    setLoadingMetricMostFrequentOrderedParts(true)
    try {
      const parts = await fetchMetricMostFrequentOrderedParts()
      setMostFrequentOrderedParts(parts)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingMetricMostFrequentOrderedParts(false)
    }
  }

  const loadMetricMostFrequentOrderedPartsCurrentMonth =  async () => {
    setLoadingMetricMostFrequentOrderedPartsCurrentMonth(true)
    try {
      const parts = await fetchMetricMostFrequentOrderedPartsCurrentMonth()
      setMostFrequentOrderedPartsCurrentMonth(parts)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingMetricMostFrequentOrderedPartsCurrentMonth(false)
    }
  }

  const loadMetricHighMaintenanceMachines = async () => {
    setLoadingMetricHighMaintenanceFactorySections(true)
    try {
      const factorySections = await fetchMetricsHighMaintenanceFactorySections()
      setHighMaintenanceFactorySections(factorySections)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingMetricHighMaintenanceFactorySections(false)
    }
  }

  const loadMetricHighMaintenanceMachinesCurrentMonth = async () => {
    setLoadingMetricHighMaintenanceFactorySectionsCurrentMonth(true)
    try {
      const factorySections = await fetchMetricsHighMaintenanceFactorySectionsCurrentMonth()
      setHighMaintenanceFactorySectionsCurrentMonth(factorySections)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingMetricHighMaintenanceFactorySectionsCurrentMonth(false)
    }
  }

  useEffect(()=>{
    loadMetricRunningMachines()
    loadMetricNotRunningMachines()
    loadMetricActiveOrders()
    loadMetricMostFrequentOrderedParts()
    loadMetricMostFrequentOrderedPartsCurrentMonth()
    loadMetricHighMaintenanceMachines()
    loadMetricHighMaintenanceMachinesCurrentMonth()
  },[])

  useEffect(() => {
    if (profile) {
      loadMetricManagableOrders();
    }
  }, [profile]); 

return (
    <>
      <NavigationBar />
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-5"> 
          {/* Top frequently ordered parts */}
          <Card className="max-w-xs p-2">
            <CardHeader>
              <CardTitle>Most frequently ordered parts</CardTitle>
              <CardDescription>Based on the number of orders made for a part, NOT from the quantity ordered</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loadingMetricMostFrequentOrderedParts ? (
                <div className="text-xl">Loading...</div>
              ) : (
                <ol className="list-decimal list-inside text-sm">
                  {mostFrequentOrderedParts && mostFrequentOrderedParts.length > 0 ? (
                    mostFrequentOrderedParts.map((part) => (
                      <li key={part.id} className="mt-1">
                        <Link to={`/viewpart/${part.id}`} className="hover:text-blue-500 hover:underline">
                          {part.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <div>No Data Available</div>
                  )}
                </ol>
              )}
            </CardContent>
          </Card>

          {/* Top frequently ordered parts Monthly*/}
          <Card className="max-w-xs p-2">
            <CardHeader>
              <CardTitle>Most frequently ordered parts (monthly)</CardTitle>
              <CardDescription>Based on the number of orders made for a part, NOT from the quantity ordered</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loadingMetricMostFrequentOrderedPartsCurrentMonth ? (
                <div className="text-xl">Loading...</div>
              ) : (
                <ol className="list-decimal list-inside text-sm">
                  {mostFrequentOrderedPartsCurrentMonth && mostFrequentOrderedPartsCurrentMonth.length > 0 ? (
                    mostFrequentOrderedPartsCurrentMonth.map((part) => (
                      <li key={part.id} className="mt-1">
                        <Link to={`/viewpart/${part.id}`} className="hover:text-blue-500 hover:underline">
                          {part.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <div>No Data Available</div>
                  )}
                </ol>
              )}
            </CardContent>
          </Card>

          {/* High Maintenance ordered parts*/}
          <Card className="max-w-xs p-2">
            <CardHeader>
              <CardTitle>High maintenance factory sections</CardTitle>
              <CardDescription>Calculated from which factory sections require most orders</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
              {loadingMetricHighMaintenanceFactorySections? (
                <div className="text-xl">Loading...</div>
              ) : (
                <ol className="list-decimal list-inside text-sm">
                  {highMaintenanceFactorySections && highMaintenanceFactorySections.length > 0 ? (
                    highMaintenanceFactorySections.map((section) => (
                      <li className="mt-1">
                        {section}
                      </li>
                    ))
                  ) : (
                    <div>No Data Available</div>
                  )}
                </ol>
              )}
            </CardContent>
          </Card>
          {/* High Maintenance ordered parts monthly*/}
          <Card className="max-w-xs p-2">
            <CardHeader>
              <CardTitle>High maintenance factory sections (monthly)</CardTitle>
              <CardDescription>Calculated from which factory sections require most orders</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
              {loadingMetricHighMaintenanceFactorySectionsCurrentMonth? (
                <div className="text-xl">Loading...</div>
              ) : (
                <ol className="list-decimal list-inside text-sm">
                  {highMaintenanceFactorySectionsCurrentMonth && highMaintenanceFactorySectionsCurrentMonth.length > 0 ? (
                    highMaintenanceFactorySectionsCurrentMonth.map((section) => (
                      <li className="mt-1">
                        {section}
                      </li>
                    ))
                  ) : (
                    <div>No Data Available</div>
                  )}
                </ol>
              )}
            </CardContent>
          </Card>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Machines Running */}
          <Card className="max-w-xs p-2">
            <CardHeader>
              <CardTitle>
                Machines running
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
              {loadingMetricRunningMachines ? (
                <div className="text-xl">Loading...</div>
              ) : (
                <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                  <span className="text-green-700">{numberOfMachinesRunning}</span>
                  {numberOfMachinesRunning==1?<span className="text-sm font-normal text-muted-foreground">machine</span>: <span className="text-sm font-normal text-muted-foreground">machines</span>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Machines Not Running */}
          <Card className="max-w-xs p-2">
            <CardHeader>
              <CardTitle>
                Machines not running
              </CardTitle>  
            </CardHeader>
            <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
              {loadingMetricNotRunningMachines ? (
                <div className="text-xl">Loading...</div>
              ) : (
                <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                  <span className="text-red-700">{numberOfMachinesNotRunning}</span>
                  {numberOfMachinesNotRunning==1?<span className="text-sm font-normal text-muted-foreground">machine</span>: <span className="text-sm font-normal text-muted-foreground">machines</span>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Managable Orders */}
          <Card className="max-w-xs p-2">
            <CardHeader>
              <CardTitle>Managable Orders</CardTitle>
              <CardDescription>Number of active orders that require your actions</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
              {loadingMetricManagableOrders ? (
                <div className="text-xl">Loading...</div>
              ) : (
                <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                  {numberOfManagableOrders}
                  <span className="text-sm font-normal text-muted-foreground">orders</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Running Orders */}
          <Card className="max-w-xs p-2">
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>Total number of orders that have not been completed i.e parts not recieved</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
              {loadingMetricActiveOrders ? (
                <div className="text-xl">Loading...</div>
              ) : (
                <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                  {numberOfActiveOrders}
                  <span className="text-sm font-normal text-muted-foreground">orders</span>
                </div>
              )}
            </CardContent>
          </Card>
          
        </div>
      </div>
    </>
  );
};

export default HomePage
