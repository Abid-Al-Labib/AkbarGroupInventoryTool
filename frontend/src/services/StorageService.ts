import toast from "react-hot-toast";
import { supabase_client } from "./SupabaseClient";
import { StoragePart } from "@/types";


export const fetchStorageParts = async (factoryId: number, partName: string, partId: number) => {
    let query = supabase_client
        .from('storage_parts')
        .select(`
            id,
            qty,
            factory_id,
            parts (*)
        `).order("id", {ascending: true})
    
        // console.log(factoryId);
    if (factoryId !== undefined) {
        query = query.eq('factory_id', factoryId);
    }
    // if (storageId !== undefined) {
    //     query = query.eq('id', storageId);
    // }
    // if (partName) {
    //     query = query.ilike('parts.name', `%${partName}%`);
    // }


    if (partId !== undefined) {
        query = query.eq('part_id', partId);
    }

    // console.log("THIS IS STORAGE ID",);
    const { data, error } = await query;

    if (error) {
        console.error('Error fetching parts:', error.message);
        return [];
    }

    let filteredData = data;

    if (partName) {
        filteredData = filteredData.filter((record: any) =>
            record.parts && record.parts.name.toLowerCase().includes(partName.toLowerCase())
        );
    }

    return filteredData;
};

export const fetchStoragePartQuantityByFactoryID = async (part_id: number, factory_id: number) => {
    let { data, error } = await supabase_client
    .from('storage_parts')
    .select('*')
    .eq('part_id',part_id)
    .eq('factory_id',factory_id)

    if (error){
        toast.error(error.message)
    }

    return data as unknown as StoragePart[]

} 

export const upsertStoragePart = async (part_id: number, factory_id: number, quantity: number) =>{
    // console.log("Adding storage of part_id ",part_id);
    const { error } = await supabase_client
    .from('storage_parts')
    .upsert({ 
        part_id: part_id,
        factory_id:factory_id,
        qty:quantity 
    }, {onConflict: 'part_id, factory_id'}
    )

    if (error){
        toast.error(error.message)
    }

}

// export const updateStoragePartQty = async (part_id: number, factory_id: number, new_quantity: number) => {
    
//     const { error } = await supabase_client
//     .from('storage_parts')
//     .update({ qty: new_quantity })
//     .eq('part_id', part_id).eq('factory_id', factory_id)

//     if (error){
//         toast.error(error.message)
//     }
        
// }

export const updateStoragePartQty = async (part_id: number, factory_id: number, quantity: number, type: 'add'|'subtract') => {
    console.group("[StorageService] updateStoragePartQty");
    console.log("Input payload", { part_id, factory_id, quantity, type });

    const { data: currentData, error } = await supabase_client
        .from('storage_parts')
        .select('qty')
        .eq('part_id', part_id).eq('factory_id', factory_id)
    console.log("Select result", { currentData, selectError: error });
    if (error) {
        toast.error(error.message)
        console.groupEnd();
        return;
    }

    let updatedQuantity = 0
    const currentQty = currentData?.[0]?.qty ?? 0;
    
    if (type === 'add') {
        console.log("Branch: add", { currentDataIsTruthy: !!currentData, firstRow: currentData?.[0] });
        updatedQuantity = currentQty + quantity;
    }
    else 
    {
        console.log("Branch: subtract", { currentDataIsTruthy: !!currentData, firstRow: currentData?.[0] });
        if (currentQty >= quantity){
            updatedQuantity = currentQty - quantity;
        } else {
            updatedQuantity = 0;
        }
    }
    console.log("Computed updatedQuantity", { updatedQuantity });
    

    
    const { error: upsertError } = await supabase_client
    .from('storage_parts')
    .upsert({
        part_id: part_id,
        factory_id: factory_id,
        qty: updatedQuantity
    }, { onConflict: 'part_id, factory_id' }
    )
    console.log("Upsert result", { upsertError });

    if (upsertError) {
        toast.error(upsertError.message)
    }   
    console.groupEnd();

}

export const editStoragePartQty = async (part_id: number, factory_id: number, new_quantity: number) => {
    
    const { error } = await supabase_client
    .from('storage_parts')
    .update({ qty: new_quantity })
    .eq('part_id', part_id).eq('factory_id', factory_id)

    if (error){
        toast.error(error.message)
    }
        
}
