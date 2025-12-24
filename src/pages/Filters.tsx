import NothingFound from "@/components/nothing-found"
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
import { Pencil, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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
  const [search, setSearch] = useState<string>("");
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
return (
  <div className="w-full h-[100vh] flex flex-col items-center p-4 overflow-hidden">
    <h1 className="self-start">Filters</h1>
    <h2 className="self-start mt-2 text-[14px] text-zinc-600 font-medium">Manage your filters bellow</h2>
     
    <div className="w-full flex flex-row gap-2 justify-end mb-2 items-center justify-center">
      <Input type="search" placeholder="Search..." className="w-50 self-start" onChange={(v) => handleSearchTerm(v.target.value)}/> 
      <Button className="cursor-pointer" variant={selection === "Lang" ? "default" : "ghost"} onClick={() => setSelection("Lang")}>Languages</Button>
      <Button className="cursor-pointer" variant={selection === "Category" ? "default" : "ghost"} onClick={() => setSelection("Category")}>Categories</Button>
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
                <Button size="icon" variant="ghost">
                  <Trash className="w-4 h-4" />
                </Button>

                <Button size="icon" variant="ghost">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)

}

