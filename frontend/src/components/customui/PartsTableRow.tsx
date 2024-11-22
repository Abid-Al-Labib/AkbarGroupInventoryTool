import React from 'react';
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { TableCell, TableRow } from "../ui/table";
import { Link } from 'react-router-dom';

interface PartsTableRowProps {
  id: number;
  name: string;
  unit: string;
  created_at: string;
}

const PartsTableRow: React.FC<PartsTableRowProps> = ({ id, name, unit, created_at }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {id}
      </TableCell>
      <TableCell>
        {name}
      </TableCell>
      <TableCell>
        {unit}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {created_at}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-haspopup="true"
              size="icon"
              variant="ghost"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link to={`/viewpart/${id}`}>
              <DropdownMenuItem>
                View
              </DropdownMenuItem>
            </Link>
            <Link to={`/editpart/${id}`}>
              <DropdownMenuItem>
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default PartsTableRow;
