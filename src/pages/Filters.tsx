import EditFiltersModal from "@/components/filters/edit-filters-modal"
import DeleteFiltersModal from "@/components/filters/delete-filters-modal"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProgrammingLanguages, ProjectCategories } from "@/lib/project/interfaces"
import { solveImageFromCategory, solveImageFromLanguage } from "@/lib/project/utils"
import { Pencil, Plus, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"



type EditableCell = {
  image: string | undefined
  name: string
}


interface ProgrammingLanguagesCell {
  image: string | undefined, 
  name: string 
}

interface CategoriesCell {
  image: string | undefined, 
  name: string 
}

export default function Filters() {
  const [languages, setLanguages] = useState<Array<ProgrammingLanguagesCell>>([]);
  const [categories, setCategories] = useState<Array<CategoriesCell>>([]);
  const [selection, setSelection] = useState<"Lang" | "Category">("Lang");
  const [render, setRender] = useState<number>(0); // hack for tick and re-render 

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [activeCell, setActiveCell] = useState<EditableCell | null>(null)

  const [editName, setEditName] = useState("")
  const [editImage, setEditImage] = useState<File | null>(null)


  const cellArrayRef = useRef<Array<ProgrammingLanguagesCell> | Array<CategoriesCell>>([])

  useEffect(() => {
    cellArrayRef.current = selection === "Lang" ? languages : categories;
    setRender(render == 0 ? 1 : 0);
  }, [selection, languages, categories])

  useEffect(() => {

  const langs = Object.values(ProgrammingLanguages) as Array<string>
  const cats = Object.values(ProjectCategories) as Array<string> 
  
  const languagesCell: Array<ProgrammingLanguagesCell> = langs.map((l) => ({
    image: solveImageFromLanguage(l as ProgrammingLanguages) || undefined,
    name: l,
  }));

  const categoriesCell: Array<CategoriesCell> = cats.map((c) => ({
    image: solveImageFromCategory(c as ProjectCategories) || undefined,
    name: c,
  }));

  setLanguages(languagesCell);
  setCategories(categoriesCell);

  }, [])

  const handleSearchTerm = (s: string) => {
    if(s.trim() === "") {
      cellArrayRef.current = selection === "Lang" ? languages : categories;
      setRender(render === 0 ? 1 : 0); // tick 
      return;
    }
    cellArrayRef.current = selection === "Lang" ? languages : categories;
    cellArrayRef.current = cellArrayRef.current.filter((cell) => cell.name.toLowerCase().includes(s.toLowerCase()));
    setRender(render === 0 ? 1 : 0);
  }


  const openEditModal = (cell: EditableCell) => {
  setActiveCell(cell)
  setEditName(cell.name)
  setEditImage(null)
  setEditOpen(true)

  }

  const openDeleteModal = (cell: EditableCell) => {
    setActiveCell(cell)
    setDeleteOpen(true)
  }

  const handleConfirmEdit = () => {
    if (!activeCell) return

  const update = (arr: Array<EditableCell>) =>
    arr.map((c) =>
      c.name === activeCell.name
        ? {
            ...c,
            name: editName,
            image: editImage ? URL.createObjectURL(editImage) : c.image,
          }
        : c
    )

  if (selection === "Lang") {
    setLanguages(update(languages))
  } else {
    setCategories(update(categories))
  }

  setEditOpen(false)
}

const handleConfirmDelete = () => {
  if (!activeCell) return

  const filter = (arr: Array<EditableCell>) =>
    arr.filter((c) => c.name !== activeCell.name)

  if (selection === "Lang") {
    setLanguages(filter(languages))
  } else {
    setCategories(filter(categories))
  }

  setDeleteOpen(false)
}



return (
  <div className="w-full h-[100vh] flex flex-col items-center p-4 overflow-hidden">
    <h1 className="self-start">Filters</h1>
    <h2 className="self-start mt-2 text-[14px] text-zinc-600 font-medium">Manage your filters bellow</h2>
     
    <div className="w-full flex flex-row gap-2 mt-5 items-center justify-between mb-2">
      <div className="flex flex-row items-center justify-center gap-2">
        <Input type="search" placeholder="Search..." className="w-50 self-start" onChange={(v) => handleSearchTerm(v.target.value)}/> 
        <Button className="cursor-pointer" variant={selection === "Lang" ? "default" : "ghost"} onClick={() => setSelection("Lang")}>Languages</Button>
        <Button className="cursor-pointer" variant={selection === "Category" ? "default" : "ghost"} onClick={() => setSelection("Category")}>Categories</Button>
      </div>
      <Button className="cursor-pointer self-end bg-zinc-100" variant={"ghost"}><Plus/></Button>
      </div>

    <Table className="w-full border border-2 rounded-lg overflow-hidden">
      
      <TableCaption className="mt-4 text-muted-foreground">
      {selection === "Lang" ? "A list of your programming languages" : "A list of your categories"}
      </TableCaption>

      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-16 text-center">Image</TableHead>
          <TableHead className="text-center">{selection === "Lang" ? "Language" : "Category"}</TableHead>
          <TableHead className="w-32 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {cellArrayRef.current.map((v) => (
          <TableRow
            key={v.name}
            className="hover:bg-muted/40 transition-colors"
          >
            <TableCell className="text-center align-middle">
              <div className="flex items-center justify-center">
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-7 h-7 object-contain"
                />
              </div>
            </TableCell>

            <TableCell className="text-center align-middle font-medium">
              {v.name}
            </TableCell>

            <TableCell className="text-center align-middle">
              <div className="flex items-center justify-center gap-2">
                <Button size="icon" variant="ghost" onClick={() => openDeleteModal(v)}>
                  <Trash className="w-4 h-4" />
                </Button>

                <Button size="icon" variant="ghost" onClick={() => openEditModal(v)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <DeleteFiltersModal
        open={deleteOpen}
        onOpenChange={(b) => setDeleteOpen(b)}
        title={activeCell !== null ? activeCell.name : ""}
        onDelete={() => {
          toast.message("Deleted.");
          setDeleteOpen(false)
        }}  
    />

    <EditFiltersModal
      defaultName={activeCell !== null ? activeCell.name : ""}
      title={activeCell !== null ? activeCell.name : ""}
      open={editOpen}
      onOpenChange={(b) => setEditOpen(b)}
      onSubmit={(n, i)  => {
        toast.message(`Editing: ${n}`);
        setEditOpen(false)
        }
      }
    />




  </div>
)

}

