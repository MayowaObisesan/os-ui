"use client";

import dynamic from "next/dynamic";

export const NoteEditor = dynamic(() => import("./NoteEditor"), { ssr: false });
