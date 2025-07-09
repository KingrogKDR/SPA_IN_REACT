import { useEffect, useRef, useState } from "react";
import { highlightMatch } from "../../lib/highlightMatch";
import { Input } from "./Input";

interface EditableCellProps {
  value: string;
  onEditChange: (value: string) => void;
  search: string;
}

const EditableCell = ({ value, onEditChange, search }: EditableCellProps) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.select();
    }
  }, [editing]);

  return editing ? (
    <Input
      value={localValue}
      ref={inputRef}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => {
        setEditing(false);
        onEditChange(localValue);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setEditing(false);
          onEditChange(localValue);
        }
      }}
      autoFocus
      className="text-sm"
    />
  ) : (
    <span
      className="cursor-pointer text-muted-foreground hover:text-foreground"
      onClick={() => setEditing(true)}
    >
      {highlightMatch(value, search)}
    </span>
  );
};

export default EditableCell;
