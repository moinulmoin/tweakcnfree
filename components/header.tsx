"use client";

import FigmaIcon from "@/assets/figma.svg";
import GitHubIcon from "@/assets/github.svg";
import Logo from "@/assets/logo.svg";
import { FigmaExportDialog } from "@/components/figma-export-dialog";
import { SocialLink } from "@/components/social-link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import { useGithubStars } from "@/hooks/use-github-stars";
import { formatCompactNumber } from "@/utils/format";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const { stargazersCount } = useGithubStars("moinulmoin", "tweakcnfree");
  const [figmaDialogOpen, setFigmaDialogOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-6" title="freetweakcn" />
            <span className="hidden font-bold md:block">freetweakcn</span>
          </Link>
        </div>
        <div className="flex items-center gap-3.5">
          <SocialLink
            href="https://github.com/moinulmoin/tweakcnfree"
            className="flex items-center gap-2 text-sm font-bold"
          >
            <GitHubIcon className="size-4" />
            {stargazersCount > 0 && formatCompactNumber(stargazersCount)}
          </SocialLink>
          <Separator orientation="vertical" className="h-8" />
          <Button
            onClick={() => setFigmaDialogOpen(true)}
            variant="outline"
            className="flex h-8 items-center gap-2"
          >
            <FigmaIcon className="size-4" />
            <span className="hidden md:inline">Export to Figma</span>
          </Button>
          <UserProfileDropdown />
        </div>
      </div>

      <FigmaExportDialog open={figmaDialogOpen} onOpenChange={setFigmaDialogOpen} />
    </header>
  );
}
