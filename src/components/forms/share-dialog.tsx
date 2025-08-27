
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share, Twitter, Linkedin, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formName: string;
  formUrl: string;
}

export function ShareDialog({
  isOpen,
  setIsOpen,
  formName,
  formUrl,
}: ShareDialogProps) {
  const { toast } = useToast();

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageSquare,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this form: ${formName}\n${formUrl}`)}`,
    },
    {
      name: "X / Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this form: ${formName}\n${formUrl}`)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(formUrl)}&title=${encodeURIComponent(formName)}`,
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: formName,
          text: `Please fill out this form: ${formName}`,
          url: formUrl,
        });
      } catch (error) {
        console.error("Error using Web Share API:", error);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Your browser does not support native sharing.",
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formUrl);
    toast({
        title: "Link Copied!",
        description: "The form link has been copied to your clipboard.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Form</DialogTitle>
          <DialogDescription>
            Share "{formName}" with others to collect responses.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
            <div className="flex justify-around">
                {shareOptions.map((option) => (
                    <a href={option.url} key={option.name} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-full">
                            <option.icon className="h-6 w-6" />
                            <span className="sr-only">Share on {option.name}</span>
                        </Button>
                    </a>
                ))}
            </div>
            <div className="flex items-center space-x-2">
              <Input value={formUrl} readOnly />
              <Button size="icon" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
            {navigator.share && (
                <Button className="w-full" onClick={handleNativeShare}>
                    <Share className="mr-2 h-4 w-4" />
                    Share via...
                </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
