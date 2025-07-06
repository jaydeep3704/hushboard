"use client";

import { FilterIcon, SearchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useCallback } from "react";

export const categories = [
  { value: "all", label: "All Categories" },
  { value: "technology", label: "Technology" },
  { value: "personal", label: "Personal" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "support", label: "Support" },
  { value: "random", label: "Random" },
];

// ✅ Debounce utility (simple, lightweight)
function debounce<Func extends (...args: any[]) => void>(func: Func, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<Func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [categoryValue, setCategoryValue] = useState(searchParams.get("category") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");

  // ✅ Core function to update URL (no debounce here)
  const updateFilters = useCallback((q: string, category: string, status: string) => {
    const params = new URLSearchParams();
    params.set("q", q);
    params.set("category", category);
    params.set("status", status);
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router]);

  // ✅ Debounced version of updateFilters
  const debouncedUpdateFilters = useRef(
    debounce(updateFilters, 500)
  ).current;

  return (
    <Card className="lg:col-span-1 col-span-2 h-fit">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-3">
          <FilterIcon className="size-5" /> Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid space-y-2">
          <Label className="text-md font-medium text-muted-foreground" htmlFor="search">
            Search Boards
          </Label>
          <div className="flex items-center relative">
            <SearchIcon className="size-4 text-muted-foreground absolute left-3" />
            <Input
              id="search"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                debouncedUpdateFilters(value, categoryValue, status);
              }}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid space-y-2">
          <Label className="text-md font-medium text-muted-foreground">Category</Label>
          <Select
            value={categoryValue}
            onValueChange={(value) => {
              setCategoryValue(value);
              updateFilters(searchQuery, value, status); // no debounce for category
            }}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value} id={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid space-y-2">
          <Label className="text-md font-medium text-muted-foreground">Status</Label>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              updateFilters(searchQuery, categoryValue, value); // no debounce for status
            }}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Boards</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
