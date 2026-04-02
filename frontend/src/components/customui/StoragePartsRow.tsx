import { useState } from 'react';
import { TableCell, TableRow } from '../ui/table';
import { editStoragePartQty } from "@/services/StorageService";
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';


interface StoragePartsRowProps {
    part: {
        storageId: number;
        id: number;
        name: string;
        description: string;
        qty: number;
        factory_name: string;
        factory_id: number;
    };
    canManage: boolean;
    onPartUpdated: () => Promise<void>;
}

const StoragePartsRow: React.FC<StoragePartsRowProps> = ({ part, canManage, onPartUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newQty, setNewQty] = useState<number>(part.qty);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    
    const handleSave = async () => {
        try {
            await editStoragePartQty(part.id, part.factory_id, newQty);
            await onPartUpdated();
            setIsEditing(false);
            toast.success("Quantity updated successfully");
        } catch (error) {
            toast.error("Failed to update quantity");
        }
    };

    const handleSoftRemove = async () => {
        try {
            await editStoragePartQty(part.id, part.factory_id, 0);
            await onPartUpdated();
            toast.success("Part quantity set to 0");
            setIsRemoveDialogOpen(false);
        } catch (error) {
            toast.error("Failed to remove part");
        }
    };
    
    return (
        <TableRow>
            {/* <TableCell>{part.storageId}</TableCell> */}
            <TableCell>{part.id}</TableCell>
            <TableCell>{part.name}</TableCell>
            <TableCell>
                {isEditing ? (
                    <input
                        type="number"
                        value={newQty}
                        onChange={(e) => setNewQty(Number(e.target.value))}
                        className="border p-1 rounded w-20"
                    />
                ) : (
                    part.qty
                )}
            </TableCell>
            <TableCell>{part.factory_name}</TableCell>
            <TableCell>
                {canManage && (
                    isEditing ? (
                        <>
                            <Button onClick={handleSave} className="ml-2">Save</Button>
                            <Button onClick={() => setIsEditing(false)} className="ml-2">Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setIsEditing(true)} className="ml-2">Edit</Button>
                            <Button onClick={() => setIsRemoveDialogOpen(true)} className="ml-2 bg-red-700 hover:bg-red-800">Remove</Button>
                        </>
                    )
                )}
            </TableCell>
            <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Remove part from table</DialogTitle>
                        <DialogDescription>
                            This will set quantity to 0 and remove this row from the current table view.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleSoftRemove} className="bg-red-700 hover:bg-red-800">Confirm Remove</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TableRow>
    );
};

export default StoragePartsRow;


