"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RedirectWithToast({
  href,
  title,
  description,
  variant,
}: {
  href: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}) {
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    toast({
      title: title,
      description: description ? description : undefined,
      variant: variant ? variant : "default",
    });
    router.push(href);
  }, [toast, router, href, description, title, variant]);

  return null;
}
