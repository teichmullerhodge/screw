import { Button } from "@/components/ui/button"
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
import { useEffect, useState } from "react"

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

  return (
    <div className="flex flex-row gap-2 w-full h-[70vh] items-center justify-center p-4">
    <Table className="border border-1">
      <TableCaption>A list of your Programming languages.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Language</TableHead>
          <TableHead>Actions</TableHead> 
        </TableRow>
      </TableHeader>
      <TableBody>
        {languages.map((l) => (
          <TableRow key={l.name}>
            <TableCell className="font-medium">
            <img 
              src={l.image}
              alt="" 
              className="w-6 h-6 bg-transparent"

            />

            </TableCell>
            <TableCell>{l.name}</TableCell>
            <TableCell>
              <Button className="border" variant={"ghost"}>
                <Trash/>    
              </Button>         
              
              <Button className="border ml-1" variant={"ghost"}>
                <Pencil/>
              </Button>
              
           </TableCell>
          </TableRow>
        ))}
      </TableBody>
   </Table>
    </div>
  )
}

