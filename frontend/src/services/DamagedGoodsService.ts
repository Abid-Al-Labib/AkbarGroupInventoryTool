import { DamagedPart } from "@/types";
import { supabase_client } from "./SupabaseClient";
import toast from "react-hot-toast";

export const fetchDamagedPartsByFactoryID = async (factoryId: number, partName: string | null, partId: number | null) => {
    let query = supabase_client
        .from('damaged_parts')
        .select(`
            id,
            qty,
            factory_id,
            part_id,
            parts (*)
        `)
        .eq('factory_id', factoryId)
    
    if (partId) {
        query = query.eq('part_id', partId);
    }

    const { data, error } = await query.order("id", {ascending: true});

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
    
    return filteredData as unknown as DamagedPart[]
};


export const updateDamagePartQuantity = async (factory_id:number, part_id:number, new_quantity:number) => {
    const { error } = await supabase_client
    .from('damaged_parts')
    .update({ qty: new_quantity })
    .eq('part_id', part_id).eq('factory_id', factory_id)

    if (error){
        toast.error(error.message)
    }

}

export const addDamagePartQuantity = async (factory_id: number, part_id: number, added_quantity: number) => {
    // Fetch the current quantity for the given factory_id and part_id
    const { data: currentData, error: fetchError } = await supabase_client
        .from("damaged_parts")
        .select("qty")
        .eq("part_id", part_id)
        .eq("factory_id", factory_id);

    // Handle error if the fetch fails
    if (fetchError) {
        toast.error(fetchError.message);
        return;
    }

    // Calculate the updated quantity by adding the new quantity to the current quantity
    const currentQty = currentData && currentData.length > 0 ? currentData[0].qty : 0;
    const updatedQuantity = currentQty + added_quantity;

    // Update the damaged part quantity in the database
    const { error: updateError } = await supabase_client
        .from("damaged_parts")
        .upsert(
            {
                part_id: part_id,
                factory_id: factory_id,
                qty: updatedQuantity,
            },
            { onConflict: "part_id, factory_id" } // Ensure conflict is managed correctly
        );

    // Handle update error if it occurs
    if (updateError) {
        toast.error(updateError.message);
    } 
    // else {
    //     toast.success("Damaged part quantity updated successfully!");
    // }
};