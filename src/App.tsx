import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import { Button } from "./components/ui/Button";
const Table = lazy(() => import("./components/Table"));

export interface Comment {
  postId: number;
  id: number;
  name: string;
  body: string;
  email: string;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
}

const COMMENTS_API = "https://jsonplaceholder.typicode.com/comments";
const POSTS_API = "https://jsonplaceholder.typicode.com/posts";
const PAGE_SIZE = 10;

function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Record<number, string>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [edited, setEdited] = useState<Record<number, Partial<Comment>>>({});
  const [loading, setLoading] = useState(false);

  const notifyEdit = (value: string) => {
    toast(`Edited as "${value}!"`, {
      hideProgressBar: true,
      autoClose: 2000,
    });
  };

  const notifyReset = () => {
    toast("Data reset to original!", {
      hideProgressBar: true,
      autoClose: 3000,
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem("editedComments");
    if (saved) setEdited(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [commentRes, postRes] = await Promise.all([
        fetch(COMMENTS_API),
        fetch(POSTS_API),
      ]);

      const commentData: Comment[] = await commentRes.json();
      const postData: Post[] = await postRes.json();

      const postMap: Record<number, string> = {};

      postData.forEach((post) => (postMap[post.id] = post.title));

      setComments(commentData);
      setPosts(postMap);
      setLoading(false);
    };

    fetchData();
  }, []);

  const mergedComments = useMemo(() => {
    return comments.map((c) => ({
      ...c,
      ...(edited[c.id] || {}),
    }));
  }, [comments, edited]);

  const filtered = mergedComments.filter((c) =>
    [c.name, c.body, c.email].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);

  const handleEdit = (id: number, field: keyof Comment, value: string) => {
    const original = comments.find((c) => c.id === id);
    const previous = edited[id]?.[field] ?? original?.[field];

    if (value === previous) return;

    setEdited((prev) => {
      const updated = {
        ...prev,
        [id]: {
          ...(prev[id] || {}),
          [field]: value,
        },
      };
      localStorage.setItem("editedComments", JSON.stringify(updated));
      return updated;
    });
    notifyEdit(value);
  };

  const handleReset = () => {
    localStorage.removeItem("editedComments");
    setEdited({});
    notifyReset();
  };

  return (
    <>
      <main className="py-20 px-40 flex flex-col justify-center items-center gap-12">
        <Navbar search={search} setSearch={setSearch} />
        <Button
          variant="destructive"
          onClick={handleReset}
          className="bg-red-600"
        >
          Reset All
        </Button>
        <Suspense
          fallback={
            <div className="w-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent" />
            </div>
          }
        >
          <Table
            comments={paginated}
            posts={posts}
            page={page}
            onEdit={handleEdit}
            setPage={setPage}
            pageCount={pageCount}
            search={search}
            loading={loading}
          />
        </Suspense>
        <ToastContainer toastClassName="relative flex p-3 rounded-md bg-white text-black shadow-lg" />
      </main>
    </>
  );
}

export default App;
