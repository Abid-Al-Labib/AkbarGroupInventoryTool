import { convertUtcToBDTime } from "@/services/helper"
import { Check, X } from "lucide-react"

export interface StatusTrackerItemProp {
    status: string,
    action_at: string| null,
    action_by: string| null,
    complete: boolean
  }
  

export const StatusTrackerItem: React.FC<StatusTrackerItemProp> = ({ status, action_at,action_by,complete}) => {
    return (
        <div className={`grid gap-2 rounded-lg p-2 ${complete ? "border-green-500" : "border-red-500"} border-2`}>
            <div className="font-semibold flex justify-between">
               {status}
               {complete ? (
                    <Check className="text-green-500 mr-2" />
                    ) : (
                    <X className="text-red-500 mr-2" />
                )}    
            </div>
            <ul className="grid gap-2">
                
                {action_at? (
                    <li className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground whitespace-nowrap">Action at</span>
                        <span className="whitespace-nowrap">{convertUtcToBDTime(action_at)}</span>
                    </li>): (<div></div>)
                }
                {action_by? (
                    <li className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground whitespace-nowrap">Action by</span>
                        <span className="whitespace-nowrap">{action_by}</span>
                    </li>): (<div></div>)
                }
            </ul>
        </div>
  )
}
