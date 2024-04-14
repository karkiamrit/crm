"use client";
import Link from "next/link";
// import Image from 'next/image';

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import { LocalStore } from "@/store/localstore";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Iconlist";

type Note = {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};

const LeadNote: React.FC<{ id: number }> = ({ id }) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesCount, setNotesCount] = useState(0);

  const [editing, setEditing] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");

  const [newNoteContent, setNewNoteContent] = useState<string>("");

  const handleUpdate = (id: number, content: string) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/notes/${id}`,
        {
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${LocalStore.getAccessToken()}`,
          },
        }
      )
      .then((response) => {
        setNotes(
          notes.map((note) => (note.id === id ? { ...note, content } : note))
        );
      })
      .catch((error) => {
        console.error(`Failed to update note: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            error.response?.data?.message ||
            `Failed to update note: ${error.message}`,
        });
      });
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${LocalStore.getAccessToken()}`,
        },
      })
      .then((response) => {
        setNotesCount(notesCount - 1);
        setNotes(notes.filter((note) => note.id !== id));
      })
      .catch((error) => {
        console.error(`Failed to delete note: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Failed to delete note: ${error.message}`,
        });
      });
  };

  const handleCreate = (content: string) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/notes`,
        {
          content,
          leadId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${LocalStore.getAccessToken()}`,
          },
        }
      )
      .then((response) => {
        setNotesCount(notesCount + 1);
        setNotes((prevNotes) => [...prevNotes, response.data]);
      })
      .catch((error) => {
        console.error(`Failed to create note: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Failed to create note: ${error.message}`,
        });
      });
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_LEADS}/notes?lead=${id}`,
        {
          headers: {
            Authorization: `Bearer ${LocalStore.getAccessToken()}`,
          },
        }
      )
      .then((response) => {
        setNotes(response.data.data);
        setNotesCount(response.data.total);
      })
      .catch((error) => {
        console.error(`Failed to fetch leads: ${error.message}`);
      });
  }, []);
  return (
    <section className="bg-white dark:bg-gray-900 py-8 rounded-lg  antialiased">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl pl-6 font-bold text-gray-900 dark:text-white">
            Notes ({notesCount})
          </h2>
        </div>
        <Separator />
        {notes.map((note: Note, index) => (
          <article
            key={index}
            className="p-6 text-base bg-white rounded-lg dark:bg-gray-900"
          >
            <footer className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                  <Avatar className="mr-2 w-6 h-6 rounded-full">
                    <AvatarImage
                      src="/avatar.png"
                      className="rounded-full grayscale"
                    />
                  </Avatar>
                  {note.author}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(note.updatedAt).toLocaleString()}
                </p>
              </div>
              {/* <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                  {" "}
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 3"
                  >
                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setEditing(note.id);
                      setEditedContent(note.content);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(note.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
              <div className="flex flex-row gap-4">
                <div
                  onClick={() => {
                    if (editing === note.id) {
                      setEditing(null);
                      setEditedContent("");
                    } else {
                      setEditing(note.id);
                      setEditedContent(note.content);
                    }
                  }}
                  className={`cursor-pointer p-2 mb-2 rounded-md ${
                    editing === note.id
                      ? "border border-gray-transparent"
                      : "border border-transparent"
                  }`}
                >
                  <Icon type="pencil" width={15} height={15} />
                </div>
                <div
                  onClick={() => handleDelete(note.id)}
                  className="cursor-pointer p-2 mb-2 rounded-md border border-transparent"
                >
                  <Icon type="trash" width={15} height={15} />
                </div>
              </div>
            </footer>
            {editing === note.id ? (
              <Textarea
                value={editedContent}
                className="resize-none"
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleUpdate(note.id, editedContent);
                    setEditing(null);
                  }
                }}
                onBlur={() => {
                  handleUpdate(note.id, editedContent);
                  setEditing(null);
                }}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">{note.content}</p>
            )}
          </article>
        ))}
        <div className="pl-6 mt-4">
          <Textarea
            placeholder="Add A Note"
            className="resize-none h-24"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCreate(newNoteContent);
                setNewNoteContent("");
              }
            }}
          />
        </div>
        <div className="flex flex-row justify-end items-center mt-4">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleCreate(newNoteContent);
              setNewNoteContent("");
            }}
          >
            Add a Note
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LeadNote;
