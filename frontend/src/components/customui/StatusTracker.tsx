import { MoveDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { StatusTrackerItem, StatusTrackerItemProp } from "./StatusTrackerItem"
import { useEffect, useState } from "react";
import { fetchStatuses } from "@/services/StatusesService";
import { fetchStatusTrackerByID } from "@/services/StatusTrackerService";
import { mergeStatusWithTracker } from "@/services/helper";
import { supabase_client } from "@/services/SupabaseClient";

interface StatusTrackerProp {
  order_id: number;
}


const StatusTracker: React.FC<StatusTrackerProp> = ({order_id}) => {
    
    const [mergedStatuses, setMergedStatuses] = useState<StatusTrackerItemProp[]>([]);

    const fetchData = async () => {
      const allStatuses = await fetchStatuses();
      const statusTracker = await fetchStatusTrackerByID(order_id);
      const merged = mergeStatusWithTracker(allStatuses,statusTracker);
      setMergedStatuses(merged);
    };
    useEffect(()=>{
      const channel = supabase_client
      .channel('status_tracker-changes')
      .on(
          'postgres_changes',
          {
          event: '*',
          schema: 'public',
          table: 'status_tracker'
          },
          () => {
              console.log("Changes detect, processing realtime")
              fetchData();
          }
      )
      .subscribe()
      fetchData();
    },[supabase_client]);

    return (
    <Card className="overflow-hidden overflow-y-scroll h-[60vh]" x-chunk="dashboard-05-chunk-4">
    <CardHeader className="sticky top-0 flex flex-row items-start bg-muted">
      <div className="grid gap-0.5">
        <CardTitle className="group flex items-center gap-2 text-lg">
          Status Tracker
        </CardTitle>
        <CardDescription>In Progress</CardDescription>
      </div>
    </CardHeader>
    <CardContent className="p-6 text-sm">
    {mergedStatuses.map((status, index) => (
          <div key={index}>
            <StatusTrackerItem
              status={status.status}
              action_at={status.action_at}
              action_by={status.action_by}
              complete={status.complete}
            />
            {index < mergedStatuses.length - 1 && (
              <div className="grid justify-center my-2">
                <MoveDown />
              </div>
            )}
          </div>
        ))}
    </CardContent>
  </Card>
  )
}

export default StatusTracker