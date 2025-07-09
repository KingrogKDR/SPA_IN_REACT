import { memo } from "react";
import type { Comment } from "../../App";
import { highlightMatch } from "../../lib/highlightMatch";
import EditableCell from "./EditableCell";

interface MemoizedRowProps {
  comment: Comment;
  postTitle: string;
  onEdit: (id: number, field: keyof Comment, value: string) => void;
  search: string;
}

const MemoizedRow = memo(
  ({ comment, postTitle, onEdit, search }: MemoizedRowProps) => {
    return (
      <tr
        key={comment.id}
        className="border-t hover:bg-accent transition-colors"
      >
        <td className="p-4 border-r">
          {highlightMatch(comment.email, search)}
        </td>
        <td className="p-4 border-r">
          <EditableCell
            value={comment.name}
            onEditChange={(value) => onEdit(comment.id, "name", value)}
            search={search}
          />
        </td>
        <td className="p-4 border-r">
          <EditableCell
            value={comment.body}
            onEditChange={(value) => onEdit(comment.id, "body", value)}
            search={search}
          />
        </td>
        <td className="p-4">{postTitle}</td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    // Prevent re-render unless this row's data or search changes
    return (
      prevProps.comment === nextProps.comment &&
      prevProps.search === nextProps.search &&
      prevProps.postTitle === nextProps.postTitle
    );
  }
);

export default MemoizedRow;
