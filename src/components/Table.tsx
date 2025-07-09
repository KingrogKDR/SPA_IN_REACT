import { Loader2 } from "lucide-react";
import type { Comment } from "../App";
import { Button } from "./ui/Button";
import MemoizedRow from "./ui/MemoizedRow";

interface TableProps {
  comments: Comment[];
  posts: Record<number, string>;
  onEdit: (id: number, field: keyof Comment, value: string) => void;
  page: number;
  setPage: (n: number | any) => void;
  pageCount: number;
  search: string;
  loading: boolean;
}

const Table = ({
  comments,
  posts,
  page,
  setPage,
  pageCount,
  onEdit,
  search,
  loading,
}: TableProps) => {
  return (
    <>
      {loading ? (
        <Loader2 className="animate-spin text-black h-6 w-6" />
      ) : (
        <div className="border rounded-md shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="p-3 font-medium border-r">Email</th>
                <th className="p-3 font-medium border-r">Name</th>
                <th className="p-3 font-medium border-r">Body</th>
                <th className="p-3 font-medium">Post</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <MemoizedRow
                  key={comment.id}
                  comment={comment}
                  postTitle={posts[comment.postId]}
                  onEdit={onEdit}
                  search={search}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => setPage((prev: number) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          <img src="prev.svg" alt="prev" width={24} height={24} />
        </Button>
        {Array.from({ length: 3 }, (_, i) => {
          const startPage = Math.min(
            Math.max(page - 1, 1),
            Math.max(pageCount - 2, 1)
          );
          const pageNum = startPage + i;

          if (pageNum > pageCount) return null;

          return (
            <Button
              key={pageNum}
              variant={page === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(pageNum)}
              className="text-lg"
            >
              {pageNum}
            </Button>
          );
        })}
        <Button
          variant="default"
          size="sm"
          onClick={() =>
            setPage((prev: number) => Math.min(prev + 1, pageCount))
          }
          disabled={page === pageCount}
        >
          <img src="next.svg" alt="next" width={24} height={24} />
        </Button>
      </div>
    </>
  );
};

export default Table;
