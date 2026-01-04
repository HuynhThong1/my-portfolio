'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MailOpen, Archive, Trash2, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');

  useEffect(() => {
    loadMessages();
  }, [filter]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/messages?filter=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, read: boolean) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Message marked as ${read ? 'read' : 'unread'}`,
        });
        loadMessages();
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update message:', error);
      toast({
        title: 'Error',
        description: 'Failed to update message',
        variant: 'destructive',
      });
    }
  };

  const handleArchive = async (id: string, archived: boolean) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Message ${archived ? 'archived' : 'unarchived'}`,
        });
        loadMessages();
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to archive message:', error);
      toast({
        title: 'Error',
        description: 'Failed to archive message',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Message deleted successfully',
        });
        setIsDialogOpen(false);
        loadMessages();
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  const handleOpenMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);

    // Mark as read when opened
    if (!message.read) {
      await handleMarkAsRead(message.id, true);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Contact form submissions {unreadCount > 0 && `(${unreadCount} unread)`}
          </p>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && <Badge className="ml-2" variant="secondary">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`hover:shadow-lg transition-shadow cursor-pointer ${!message.read ? 'border-primary' : ''}`}
            onClick={() => handleOpenMessage(message)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {message.read ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary" />
                    )}
                    <CardTitle className="text-lg">
                      {message.subject || 'No Subject'}
                    </CardTitle>
                    {!message.read && (
                      <Badge variant="default">New</Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {message.name} ({message.email})
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(message.createdAt)}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(message.id, !message.read)}
                    title={message.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {message.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArchive(message.id, !message.archived)}
                    title={message.archived ? 'Unarchive' : 'Archive'}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(message.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {message.message}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {messages.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'No unread messages' :
               filter === 'read' ? 'No read messages' :
               filter === 'archived' ? 'No archived messages' :
               'No messages yet'}
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject || 'No Subject'}</DialogTitle>
            <DialogDescription>
              From: {selectedMessage?.name} ({selectedMessage?.email})
              <br />
              Received: {selectedMessage && formatDate(selectedMessage.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="whitespace-pre-wrap text-sm p-4 bg-muted rounded-lg">
              {selectedMessage?.message}
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => selectedMessage && handleMarkAsRead(selectedMessage.id, !selectedMessage.read)}
              >
                Mark as {selectedMessage?.read ? 'Unread' : 'Read'}
              </Button>
              <Button
                variant="outline"
                onClick={() => selectedMessage && handleArchive(selectedMessage.id, !selectedMessage.archived)}
              >
                {selectedMessage?.archived ? 'Unarchive' : 'Archive'}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => selectedMessage && window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`)}
              >
                Reply via Email
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedMessage && handleDelete(selectedMessage.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
