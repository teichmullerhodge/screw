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
import { Pencil, Plus, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import NewFilterModal from "@/components/filters/new-filter-modal"
import { ApplicationCategories, type Filters, FiltersOperation, ProgrammingLanguages, CommonFilterPayload } from "@/lib/common-interfaces"
import { solveImageFromCategory, solveImageFromLanguage } from "@/lib/templates/utils"
import { convertFileSrc, invoke } from "@tauri-apps/api/core"



type EditableCell = {
  image_path: string | undefined
  name: string
}


interface ProgrammingLanguagesCell {
  image_path: string | undefined, 
  name: string 
}

interface CategoriesCell {
  image_path: string | undefined, 
  name: string 
}

export default function Filters() {
  const [languages, setLanguages] = useState<Array<ProgrammingLanguagesCell>>([]);
  const [categories, setCategories] = useState<Array<CategoriesCell>>([]);
  const [cellArray, setCellArray] = useState<Array<CategoriesCell | ProgrammingLanguagesCell>>([]);
  const [selection, setSelection] = useState<"Lang" | "Category">("Lang");

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [newOpen, setNewOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<EditableCell | null>(null)

  const [editName, setEditName] = useState("")
  const [editImage, setEditImage] = useState<File | null>(null)


  useEffect(() => {
    if(selection === "Lang") setCellArray(languages);
    if(selection === "Category") setCellArray(categories);
  }, [selection])

  useEffect(() => {

  const langs = Object.values(ProgrammingLanguages) as Array<string>
  const categs = Object.values(ApplicationCategories) as Array<string> 
  
  const languagesCell: Array<ProgrammingLanguagesCell> = langs.map((l) => ({
    image_path: solveImageFromLanguage(l as ProgrammingLanguages) || undefined,
    name: l,
  }));

  const categoriesCell: Array<CategoriesCell> = categs.map((c) => ({
    image_path: solveImageFromCategory(c as ApplicationCategories) || undefined,
    name: c,
  }));


  // get custom filters (defined by user) 

  const getUserFilters = async () => {
    const res = await invoke("list_filters") as [Filters | null, FiltersOperation];
    console.log(JSON.stringify(res, null, 2));
    const filters = res[0];
    const operation = res[1];
    const ok = operation === FiltersOperation.Success;
    if(filters === null) {
      console.log(`Filters null`);
      setLanguages(languagesCell);
      setCategories(categoriesCell);
      setCellArray(languagesCell);
      return;
    }
    const lCell = ok ? [...languagesCell, ...filters.languages] : languagesCell;
    const cCell = ok ? [...categoriesCell, ...filters.categories] : categoriesCell;
    console.log(`ok? ${ok} - Value of cCell: ${JSON.stringify(cCell, null, 2)}`);
    setLanguages(lCell);
    setCategories(cCell);
    setCellArray(lCell);
    return;
  }

  getUserFilters();

  }, [])




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



return (
  <div className="w-full h-[100vh] flex flex-col items-center p-4 overflow-hidden">
    <h1 className="self-start">Filters</h1>
    <h2 className="self-start mt-2 text-[14px] text-zinc-600 font-medium">Manage your filters bellow</h2>
     
    <div className="w-full flex flex-row gap-2 mt-5 items-center justify-between mb-2">
      <div className="flex flex-row items-center justify-center gap-2">
        <Input type="search" placeholder="Search..." className="w-50 self-start" onChange={(v) => {}}/> 
        <Button className="cursor-pointer" variant={selection === "Lang" ? "default" : "ghost"} onClick={() => setSelection("Lang")}>Languages</Button>
        <Button className="cursor-pointer" variant={selection === "Category" ? "default" : "ghost"} onClick={() => setSelection("Category")}>Categories</Button>
      </div>
      <Button className="cursor-pointer self-end bg-zinc-100" variant={"ghost"} onClick={() => setNewOpen(true)}><Plus/></Button>
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
        {cellArray.map((v) => (
          <TableRow
            key={v.name}
            className="hover:bg-muted/40 transition-colors"
          >
            <TableCell className="text-center align-middle">
              <div className="flex items-center justify-center">
                <img
                  src={v.image_path}
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
        toast.message(`Editing: ${n} - ${i}`);
        setEditOpen(false)
        }
      }
    />
    
    <NewFilterModal 
      open={newOpen}
      onOpenChange={(b) => setNewOpen(b)}
      onSubmit={async (name, image_path) => {
        if(image_path === null || name.trim() === "") {
          toast.warning("You need to add a name and an image to your filter.");
          return;
        }

        const key = selection === "Lang" ? "languages" : "categories";
        const keyValue = selection === "Lang" ? "language" : "category";
        const addFiltersPayload: CommonFilterPayload = {
          name: name, 
          image_path: image_path,
          key: key
        };
        const res = await invoke("add_filter", { payload: JSON.stringify(addFiltersPayload, null, 2) }) as [string | null, boolean];
        const path = res[0];
        const ok = res[1];
        if(ok && path !== null) {
          toast.message(`${keyValue} properly added.`);
          return;
        }
        
        toast.error(`Error adding a new ${keyValue}. Try again later.`);
        return;
      }}
      selection={selection}
    />


  </div>
)

}

