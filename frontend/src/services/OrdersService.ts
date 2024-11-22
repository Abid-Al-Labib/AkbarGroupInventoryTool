import { Order } from "@/types";
import { supabase_client } from "./SupabaseClient";
import { convertBDTimeToUtc, isManagebleOrder, managePermission } from "./helper.ts";
import toast from "react-hot-toast";
import { fetchFactoriesByIds, fetchFactorySectionsByIds } from "./FactoriesService.ts";


export const fetchOrders = async ({
    page = 1,
    limit = 10,
    showCompleted,
    query = '',
    reqNum = '',
    searchDate,
    dateFilterType, // This is passed along with searchDate
    statusId,
    departmentId,
    factoryId,
    factorySectionId,
    machineId,
    orderType,
}: {
    page: number;
    limit: number;
    showCompleted: boolean;
    query?: string;
    reqNum?: string;
    searchDate?: Date;
    dateFilterType?: 'on' | 'before' | 'after'; // Define filterType for date filtering
    statusId?: number;
    departmentId?: number;
    factoryId?: number;
    factorySectionId?: number;
    machineId?: number;
    orderType?: string;
}) => {

    console.log(`Fetching orders with parameters: 
        Page: ${page}, 
        Limit: ${limit}, 
        Query: ${query}, 
        Req Num: ${reqNum},
        Search Date: ${searchDate}, 
        Status ID: ${statusId}, 
        Department ID: ${departmentId}, 
        Factory ID: ${factoryId},
        Factory Section ID: ${factorySectionId},
        Machine ID: ${machineId},
        OrderType: ${orderType}`
    );

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let queryBuilder = supabase_client
        .from('orders')
        .select(
            `
            id,
            req_num,
            created_at,
            order_note,
            created_by_user_id,
            department_id,
            current_status_id,
            factory_id,
            machine_id,
            factory_section_id,
            order_type,
            departments(*),
            profiles(*),
            statuses(*),
            factory_sections(*),
            factories(*),
            machines(*)
            `,
            { count: 'exact' }
        )
        .range(from, to)
        .order('id', { ascending: false });

    if (query) {
        queryBuilder = queryBuilder.eq('id', query);
    }

    if (reqNum) {
        queryBuilder = queryBuilder.eq('req_num', reqNum);
    }

    if (!showCompleted){
        queryBuilder = queryBuilder.neq('current_status_id', 8)
    }
    if (showCompleted){
        queryBuilder = queryBuilder.eq('current_status_id', 8)
    }

    if (searchDate && dateFilterType) {
        const searchDateStr = searchDate.toISOString().split('T')[0];

        // Convert to Bangladesh time for start and end of the day
        const startOfDayUTC = convertBDTimeToUtc(`${searchDateStr}T00:00:00`);
        const endOfDayUTC = convertBDTimeToUtc(`${searchDateStr}T23:59:59`);

        // Apply date range based on the filter type
        if (dateFilterType === 'on') {
            // For "on" date, search within the specific day
            queryBuilder = queryBuilder.gte('created_at', startOfDayUTC)
                .lte('created_at', endOfDayUTC);
        } else if (dateFilterType === 'before') {
            // For "before" the date, search for all orders before the start of the day
            queryBuilder = queryBuilder.lte('created_at', startOfDayUTC);
        } else if (dateFilterType === 'after') {
            // For "after" the date, search for all orders after the end of the day
            queryBuilder = queryBuilder.gte('created_at', endOfDayUTC);
        }

        console.log('Fetching orders with filterType:', dateFilterType, 'search date:', startOfDayUTC, 'to', endOfDayUTC);
    }

    if (statusId) {
        queryBuilder = queryBuilder.eq('current_status_id', statusId);
    }

    if (departmentId) {
        console.log('Fetching orders with deptID ', departmentId);
        queryBuilder = queryBuilder.eq('department_id', departmentId);
    }

    if (factoryId) {
        console.log('Fetching orders with factoryID ', factoryId);
        queryBuilder = queryBuilder.eq('factory_id', factoryId);
    }

    if (factorySectionId) {
        console.log('Fetching orders with factorySectionID ', factorySectionId);
        queryBuilder = queryBuilder.eq('factory_section_id', factorySectionId);
    }

    if (machineId) {
        console.log('Fetching orders with machineID ', machineId);
        queryBuilder = queryBuilder.eq('machine_id', machineId);
    }

    if (orderType && orderType !== 'all') {
        console.log('Fetching orders with orderType', orderType);
        queryBuilder = queryBuilder.eq('order_type', orderType);
    }

    const { data, error, count } = await queryBuilder;

    if (error) {
        toast.error(error.message);
        return { data: [], count: 0 };
    }
    return { data: data as unknown as Order[], count };
};

export const fetchOrderByID = async (order_id:number) => {
    const {data,error} = await supabase_client.from('orders').
    select(
        `
            id,
            req_num,
            created_at,
            order_note,
            created_by_user_id,
            department_id,
            current_status_id,
            factory_id,
            machine_id,
            factory_section_id,
            order_type,
            departments(*),
            profiles(*),
            statuses(*),
            factory_sections(*),
            factories(*),
            machines(*)
        `
    ).eq('id',order_id).single()
    if (error){
        return null
    }
    console.log(data)
    return data as unknown as Order;
};

export const fetchOrderByReqNum = async (reqNum: string) => {
    
    const { data, error } = await supabase_client.from('orders').
        select(
            `
            id,
            req_num,
            created_at,
            order_note,
            created_by_user_id,
            department_id,
            current_status_id,
            factory_id,
            machine_id,
            factory_section_id,
            order_type,
            departments(*),
            profiles(*),
            statuses(*),
            factory_sections(*),
            factories(*),
            machines(*)
        `
    ).eq('req_num', reqNum)
    if (error) {
        return null
    }
    // console.log(data)
    return data ?? [];
};

export const fetchOrderByReqNumandFactory = async (reqNum: string, factoryId: number) => {

    const { data, error } = await supabase_client.from('orders').
        select(
            `
            id,
            req_num,
            created_at,
            order_note,
            created_by_user_id,
            department_id,
            current_status_id,
            factory_id,
            machine_id,
            factory_section_id,
            order_type,
            departments(*),
            profiles(*),
            statuses(*),
            factory_sections(*),
            factories(*),
            machines(*)
        `
        ).ilike('req_num', reqNum).eq('factory_id',factoryId)
    if (error) {
        return null
    }
    // console.log(data)
    return data ?? [];
    
};

export const UpdateStatusByID = async (orderid: number, status_id:number) => {
    
    const { error } = await supabase_client.from('orders')
    .update({ current_status_id: status_id })
    .eq('id', orderid)
    
    if (error){
        toast.error(error.message)
    }
}

export const deleteOrderByID = async (orderid:number) => {
    
    const { error } = await supabase_client
    .from('orders')
    .delete()
    .eq('id', orderid)
    
    if(error) {
        toast.error(error.message)
    }
}


export const insertOrder = async (
    req_num: string,
    order_note: string,
    created_by_user_id: number,
    department_id: number,
    factory_id: number,
    factory_section_id: number,
    machine_id: number,
    current_status_id: number,
    order_type: string, ) => {

    const { data, error } = await supabase_client.from('orders').insert([
        {
            "req_num": req_num,
            "order_note": order_note,
            "created_by_user_id": created_by_user_id,
            "department_id": department_id,
            "factory_id": factory_id,
            "factory_section_id": factory_section_id,
            "machine_id": machine_id,
            "current_status_id": current_status_id,
            "order_type": order_type,
            
        },
        ])
        .select()

    if (error) {
        toast.error("Failed to create order: " + error.message);
    }
    return { data: data as Order[], error };
};

export const insertOrderStorage = async (
    req_num: string,
    order_note: string,
    created_by_user_id: number,
    department_id: number,
    factory_id: number,
    current_status_id: number,
    order_type: string, ) => {

    const { data, error } = await supabase_client.from('orders').insert([
        {
            "req_num": req_num,
            "order_note": order_note,
            "created_by_user_id": created_by_user_id,
            "department_id": department_id,
            "factory_id": factory_id,
            "current_status_id": current_status_id,
            "order_type": order_type,
        },
    ])
        .select()

    if (error) {
        toast.error("Failed to create order: " + error.message);
    }
    return { data: data as Order[], error };
};

export const fetchRunningOrdersByMachineId = async (machine_id: number) => {
    const { data, error } = await supabase_client.from('orders').
        select(
            `
            id,
            req_num,
            created_at,
            order_note,
            created_by_user_id,
            department_id,
            current_status_id,
            factory_id,
            machine_id,
            factory_section_id,
            order_type,
            departments(*),
            profiles(*),
            statuses(*),
            factory_sections(*),
            factories(*),
            machines(*)
        `
    ).eq('machine_id', machine_id)
        .neq('current_status_id', 8)
    if (error) {
        toast.error(error.message)
    }
    console.log("Returned Current Orders of",machine_id, data)
    return data as unknown as Order[];
}


export const fetchMetricActiveOrders = async () => {
    const { count, error } = await supabase_client.from('orders').
        select('*',{ count: 'exact', head: true })
        .neq('current_status_id', 8)
    if (error) {
        toast.error(error.message)
    }
    return count
}


export const fetchManagableOrders = async (role:string) => {
    const { data, error } = await supabase_client.from('orders').
    select(
        `
            id,
            current_status_id,
            statuses(*)
        `
    )
    .neq('current_status_id', 8)
    
    if (error) {
        toast.error(error.message)
    }

    if (!data) {
        return 0;
    }

    // Filter through the orders and check if they are manageable
    const manageableOrders = data.filter((order: any) => {
        const statusName = order.statuses?.name;
        return isManagebleOrder(statusName, role); // Check permission for the current role and status
    });

    return manageableOrders.length;
}


export const fetchMetricsHighMaintenanceFactorySections = async () => {
    const { data, error } = await supabase_client
      .from('orders')
      .select(`factory_section_id, count: factory_section_id.count()`)
      .order('count', { ascending: false })
      .limit(10);
  
    if (error) {
      toast.error(error.message);
      return null;
    }
  
    // Filter out rows where factory_section_id is null
    const filteredData = data.filter((item) => item.factory_section_id !== null);
  
    // Extract section IDs from `filteredData` to maintain order
    const sectionIds = filteredData.map((item) => item.factory_section_id);
  
    // Fetch section details and create a Map by section ID
    const sectionData = await fetchFactorySectionsByIds(sectionIds);
    if (!sectionData) return null;
    const sectionMap = new Map(sectionData.map((section) => [section.id, section]));
  
    // Extract factory IDs from the sections
    const factoryIds = sectionData.map((section) => section.factory_id);
  
    // Fetch factory details and create a Map by factory ID
    const factoryData = await fetchFactoriesByIds(factoryIds);
    if (!factoryData) return null;
    const factoryMap = new Map(factoryData.map((factory) => [factory.id, factory]));
  
    // Build the result in the order of `filteredData`
    const result = filteredData.map((item) => {
      const section = sectionMap.get(item.factory_section_id);
      if (section) {
        const factory = factoryMap.get(section.factory_id);
        return factory ? `${factory.abbreviation} - ${section.name} - (${item.count})` : `Unknown Factory - ${section.name}`;
      }
      return `Unknown Section`;
    });
  
    return result as string[];
  };


  export const fetchMetricsHighMaintenanceFactorySectionsCurrentMonth = async () => {
    // Get the start and end dates for the current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const startOfNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString();
  
    const { data, error } = await supabase_client
      .from('orders')
      .select(`factory_section_id, count: factory_section_id.count()`)
      .gte('created_at', startOfMonth)
      .lt('created_at', startOfNextMonth)
      .order('count', { ascending: false })
      .limit(10);
  
    if (error) {
      toast.error(error.message);
      return null;
    }
  
    // Filter out rows where factory_section_id is null
    const filteredData = data.filter((item) => item.factory_section_id !== null);
  
    // Extract section IDs from `filteredData` to maintain order
    const sectionIds = filteredData.map((item) => item.factory_section_id);
  
    // Fetch section details and create a Map by section ID
    const sectionData = await fetchFactorySectionsByIds(sectionIds);
    if (!sectionData) return null;
    const sectionMap = new Map(sectionData.map((section) => [section.id, section]));
  
    // Extract factory IDs from the sections
    const factoryIds = sectionData.map((section) => section.factory_id);
  
    // Fetch factory details and create a Map by factory ID
    const factoryData = await fetchFactoriesByIds(factoryIds);
    if (!factoryData) return null;
    const factoryMap = new Map(factoryData.map((factory) => [factory.id, factory]));
  
    // Build the result in the order of `filteredData`
    const result = filteredData.map((item) => {
      const section = sectionMap.get(item.factory_section_id);
      if (section) {
        const factory = factoryMap.get(section.factory_id);
        return factory ? `${factory.abbreviation} - ${section.name}` : `Unknown Factory - ${section.name}`;
      }
      return `Unknown Section`;
    });
  
    return result as string[];
  };
  