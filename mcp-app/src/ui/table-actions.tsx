import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

export type TableActionsProps<T> = {
  onEdit?: (t: T) => void;
  onDelete?: (t: T) => void;
  children?: React.ReactNode;
};

export function TableActions<T>({
  onEdit,
  onDelete,
  data,
  children,
}: TableActionsProps<T> & { data: T }) {
  return (
    <div className="flex gap-2 justify-end">
      {onEdit && (
        <Button
          variant="secondary-outline"
          size="icon"
          onClick={() => onEdit(data)}
        >
          <Edit />
        </Button>
      )}
      {onDelete && (
        <Button variant="outline" size="icon" onClick={() => onDelete(data)}>
          <Trash />
        </Button>
      )}
      {children}
    </div>
  );
}
