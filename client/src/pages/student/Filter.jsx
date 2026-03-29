import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

const categories = [
  { id: "nextjs", label: "Next JS" },
  { id: "datascience", label: "Data Science" },
  { id: "mern", label: "MERN Stack Development" },
  { id: "react", label: "React JS" },
  { id: "dsa", label: "Data Structures & Algorithms" },
  { id: "machinelearning", label: "Machine Learning" },
  { id: "ai", label: "Artificial Intelligence" },
  { id: "cloud", label: "Cloud Computing (AWS)" },
  { id: "mongodb", label: "MongoDB & Database Design" },
  { id: "frontend", label: "Frontend Development" },
  { id: "backend", label: "Backend Development" },
  { id: "fullstack", label: "Full Stack Web Development" },
  { id: "blockchain", label: "Blockchain Development" },
];

const Filter = ({handleFilterChange}) => {
    const [selectedCategories,setSelectedCategories] = useState([])
    const [sortByPrice,setSortByPrice] = useState('')

    const handleCategoryChange = (categoryId) =>{
        setSelectedCategories((prevCategories) =>{
            const newCategories = prevCategories.includes(categoryId) ?prevCategories.filter((id) => id!==categoryId)
            :
            [...prevCategories,categoryId]

            handleFilterChange(newCategories,sortByPrice)
            return newCategories
        })
    }

    const selectByPriceHandler = (selectedValue) =>{
        setSortByPrice(selectedValue)
        handleFilterChange(selectedCategories,selectedValue)
    }
  return (
    <div className="w-full md:w-[20%] ">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Filter options</h1>

        <Select onValueChange={selectByPriceHandler}>
          <SelectTrigger>
            <SelectValue placeholder="sort by " />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by price</SelectLabel>
              <SelectItem value="low">low to high</SelectItem>
              <SelectItem value="high">high to low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator className={"my-4"} />

      <div className="">
        <h1 className="font-semibold mb-2">CATEGORY</h1>

        {categories.map((category) => (
          <div className="flex items-center space-x-2 my-2">
            <Checkbox
              id={category.id}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <Label className={'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'}>{category.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
