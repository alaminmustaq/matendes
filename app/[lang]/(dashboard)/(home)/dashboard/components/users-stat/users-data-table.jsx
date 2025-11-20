"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UsersDataTable = ({ toolSnapshotTable }) => {
  return (
    <div className="h-[250px]">
      <ScrollArea className="h-full">
        <Table className="border border-border">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="text-sm h-10 font-medium text-default-800">
                Distribution Type
              </TableHead>
              <TableHead className="text-sm h-10 font-medium text-default-800 text-right">
                Quantity
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {toolSnapshotTable?.map((item) => (
              <TableRow key={item.id} className="border-b border-border">
                <TableCell className="text-xs text-default-600 py-2">
                  {item.type}
                </TableCell>
                <TableCell className="text-xs text-default-600 text-right pr-6 py-2">
                  {item.count}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default UsersDataTable;
