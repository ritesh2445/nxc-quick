"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Check, ExternalLink, Save, ArrowUp, ArrowDown } from "lucide-react";

interface ProfileLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  sortOrder: number;
  isVisible: boolean;
}

export default function ProfileEditorPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fullName, setFullName] = useState("Ritesh Martawar");
  const [designation, setDesignation] = useState("Founder & Chief Executive");
  const [company, setCompany] = useState("NXC Verse");
  const [bio, setBio] = useState(
    "Designing tactile luxury hardware and next-generation sovereign digital identities for modern visionaries."
  );
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("ritesh@nxcverse.in");
  const [website, setWebsite] = useState("https://nxcverse.in");
  const [location, setLocation] = useState("Mumbai, India");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
  );

  const [links, setLinks] = useState<ProfileLink[]>([
    {
      id: "lnk_1",
      platform: "linkedin",
      label: "LinkedIn Profile",
      url: "https://linkedin.com/in/ritesh-martawar",
      sortOrder: 0,
      isVisible: true,
    },
    {
      id: "lnk_2",
      platform: "x",
      label: "X / Twitter",
      url: "https://x.com/nxcverse",
      sortOrder: 1,
      isVisible: true,
    },
    {
      id: "lnk_3",
      platform: "instagram",
      label: "Instagram",
      url: "https://instagram.com/nxcverse",
      sortOrder: 2,
      isVisible: true,
    },
    {
      id: "lnk_4",
      platform: "website",
      label: "NXC Verse Official",
      url: "https://nxcverse.in",
      sortOrder: 3,
      isVisible: true,
    },
  ]);

  const handleAddLink = () => {
    const newLink: ProfileLink = {
      id: `lnk_${Date.now()}`,
      platform: "website",
      label: "New Connected Link",
      url: "https://",
      sortOrder: links.length,
      isVisible: true,
    };
    setLinks([...links, newLink]);
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleUpdateLink = (id: string, field: keyof ProfileLink, val: unknown) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  };

  const handleMoveLink = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;
    const newLinks = [...links];
    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, moved);
    setLinks(newLinks);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile/ritesh", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          designation,
          company,
          bio,
          phone,
          email,
          website,
          location,
          avatarUrl,
          links,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A32]">
        <div>
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.25em]">
            IDENTITY CONFIGURATION
          </span>
          <h1 className="font-sans font-medium text-2xl md:text-3xl text-[#F2F0EC] tracking-tight mt-1">
            Profile Editor
          </h1>
          <p className="font-sans text-xs text-text-secondary mt-0.5">
            Changes made here update your live public profile and .VCF contact file instantly without reprinting your card.
          </p>
        </div>

        <a href="/@ritesh" target="_blank">
          <Button variant="outline" size="sm" className="text-xs">
            <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Live Profile
          </Button>
        </a>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-6 space-y-6">
          <h3 className="font-sans font-semibold text-sm text-text-primary uppercase tracking-wider border-b border-[#2A2A32] pb-3">
            Core Identity & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans text-text-secondary uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-text-secondary uppercase tracking-wider mb-1">
                Designation / Title
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-text-secondary uppercase tracking-wider mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-text-secondary uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-text-secondary uppercase tracking-wider mb-1">
                Phone Number (Used for 1-click calls and .VCF)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-text-secondary uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-text-secondary uppercase tracking-wider mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-text-secondary uppercase tracking-wider mb-1">
                Avatar Photo URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans text-text-secondary uppercase tracking-wider mb-1">
              Executive Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[2px] p-3 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60 leading-relaxed"
            />
          </div>
        </div>

        {/* Social / Portfolio Links Section */}
        <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2A32] pb-3">
            <div>
              <h3 className="font-sans font-semibold text-sm text-text-primary uppercase tracking-wider">
                Connected Platforms & Social Links
              </h3>
              <p className="font-sans text-xs text-text-secondary mt-0.5">
                Reorder or add custom portfolio and social links.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddLink}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Link
            </Button>
          </div>

          <div className="space-y-3 pt-2">
            {links.map((link, idx) => (
              <div
                key={link.id}
                className="p-4 rounded-[2px] bg-[#18181C] border border-[#2A2A32] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                {/* Platform select */}
                <div className="sm:col-span-3">
                  <select
                    value={link.platform}
                    onChange={(e) => handleUpdateLink(link.id, "platform", e.target.value)}
                    className="w-full bg-[#111114] border border-[#2A2A32] rounded-[2px] px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="x">X / Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="github">GitHub</option>
                    <option value="youtube">YouTube</option>
                    <option value="website">Website</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {/* Label */}
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleUpdateLink(link.id, "label", e.target.value)}
                    placeholder="Label"
                    className="w-full bg-[#111114] border border-[#2A2A32] rounded-[2px] px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
                  />
                </div>

                {/* URL */}
                <div className="sm:col-span-4">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleUpdateLink(link.id, "url", e.target.value)}
                    placeholder="https://"
                    className="w-full bg-[#111114] border border-[#2A2A32] rounded-[2px] px-2.5 py-1.5 text-xs text-text-primary focus:outline-none font-mono"
                  />
                </div>

                {/* Reorder and Delete controls */}
                <div className="sm:col-span-2 flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMoveLink(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 text-text-tertiary hover:text-text-primary disabled:opacity-20"
                    aria-label="Move link up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveLink(idx, "down")}
                    disabled={idx === links.length - 1}
                    className="p-1 text-text-tertiary hover:text-text-primary disabled:opacity-20"
                    aria-label="Move link down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(link.id)}
                    className="p-1 text-text-tertiary hover:text-status-error ml-1"
                    aria-label="Delete link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#2A2A32]">
          <div>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#6FCF97]">
                <Check className="w-4 h-4" /> Changes successfully saved to sovereign record.
              </span>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="text-xs tracking-widest px-8"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" /> SAVE PROFILE CHANGES
          </Button>
        </div>
      </form>
    </div>
  );
}
