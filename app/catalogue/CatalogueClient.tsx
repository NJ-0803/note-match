"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Perfume, FragranceFamily } from "@/types/perfume";
import FamilyFilter from "@/components/FamilyFilter";
import NotesFilter, { type NotesMode } from "@/components/NotesFilter";
import PerfumeCard from "@/components/PerfumeCard";

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function CatalogueClient({ perfumes }: { perfumes: Perfume[] }) {
  const [families, setFamilies] = useState<FragranceFamily[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [notesMode, setNotesMode] = useState<NotesMode>("OR");

  const filtered = useMemo(() => {
    return perfumes.filter((p) => {
      if (families.length > 0 && !families.includes(p.family)) return false;
      if (notes.length === 0) return true;
      const perfumeNotes = new Set([...p.topNotes, ...p.heartNotes, ...p.baseNotes]);
      return notesMode === "AND"
        ? notes.every((n) => perfumeNotes.has(n))
        : notes.some((n) => perfumeNotes.has(n));
    });
  }, [perfumes, families, notes, notesMode]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">The full catalogue</h1>
        <p className="mt-1 text-muted-foreground">
          Every perfume in the database — filter by family or just browse.
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8"
      >
        <div className="flex justify-center">
          <FamilyFilter active={families} onChange={setFamilies} />
        </div>
        <div className="mt-8">
          <NotesFilter perfumes={perfumes} active={notes} mode={notesMode} onChangeActive={setNotes} onChangeMode={setNotesMode} />
        </div>
      </motion.section>

      <div className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">
            {families.length > 0 || notes.length > 0
              ? [
                  families.length > 0 ? families.join(", ") : null,
                  notes.length > 0 ? `${notes.join(notesMode === "AND" ? " + " : " or ")}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ") + " perfumes"
              : "All perfumes"}{" "}
            <span className="text-sm font-normal text-muted-foreground">({filtered.length})</span>
          </h2>
        </div>
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((p) => (
            <motion.div key={p.id} variants={cardVariants}>
              <PerfumeCard perfume={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
