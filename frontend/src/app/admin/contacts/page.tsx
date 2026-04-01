"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Contact } from "@/types";
import { fetchContacts, markContactRead, deleteContact } from "@/lib/api";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadContacts = useCallback(async () => {
    try {
      const res = await fetchContacts();
      setContacts(res.data ?? []);
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleToggleRead = async (contact: Contact) => {
    try {
      await markContactRead(contact.id);
      toast.success(
        contact.read ? "Marked as unread" : "Marked as read"
      );
      await loadContacts();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update contact"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id);
      toast.success("Contact deleted successfully");
      if (expandedId === id) setExpandedId(null);
      await loadContacts();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete contact"
      );
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
          {unreadCount > 0 && (
            <Badge variant="default">{unreadCount} unread</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Messages from your contact form
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Mail className="mx-auto mb-3 size-10 text-muted-foreground" />
              <p className="text-muted-foreground">No contacts yet.</p>
              <p className="text-xs text-muted-foreground">
                Messages from your portfolio contact form will appear here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]" />
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <>
                    <TableRow
                      key={contact.id}
                      className={`cursor-pointer ${
                        !contact.read ? "bg-primary/5" : ""
                      }`}
                      onClick={() => toggleExpanded(contact.id)}
                    >
                      <TableCell>
                        {expandedId === contact.id ? (
                          <ChevronUp className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell
                        className={`${!contact.read ? "font-semibold" : "font-medium"}`}
                      >
                        {contact.name}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {contact.email}
                        </span>
                      </TableCell>
                      <TableCell>{contact.subject}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {contact.read ? (
                          <Badge variant="secondary">Read</Badge>
                        ) : (
                          <Badge variant="default">Unread</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleRead(contact)}
                            title={
                              contact.read ? "Mark as unread" : "Mark as read"
                            }
                          >
                            {contact.read ? (
                              <Mail className="size-4" />
                            ) : (
                              <MailOpen className="size-4" />
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger
                              render={<Button variant="ghost" size="icon" />}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Contact
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this message
                                  from &quot;{contact.name}&quot;? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  variant="destructive"
                                  onClick={() => handleDelete(contact.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedId === contact.id && (
                      <TableRow key={`${contact.id}-expanded`}>
                        <TableCell colSpan={7}>
                          <div className="rounded-lg bg-muted/50 p-4">
                            <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                              Message
                            </p>
                            <p className="whitespace-pre-wrap text-sm">
                              {contact.message}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
