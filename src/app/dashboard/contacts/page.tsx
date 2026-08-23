"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Users,
  Download,
  Plus,
  Search,
  Trash2,
  Phone,
  Mail,
  Building,
  Calendar,
  FileSpreadsheet,
  Contact,
  Radio,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Check,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface ContactItem {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  designation?: string | null;
  notes?: string | null;
  source: string;
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);

  // New Contact Form
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/contacts");
      const data = await res.json();
      if (data.contacts) {
        setContacts(data.contacts);
      }
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newFullName,
          email: newEmail,
          phone: newPhone,
          company: newCompany,
          designation: newDesignation,
          notes: newNotes,
          source: "manual",
        }),
      });

      if (res.ok) {
        setAddModalOpen(false);
        setNewFullName("");
        setNewEmail("");
        setNewPhone("");
        setNewCompany("");
        setNewDesignation("");
        setNewNotes("");
        fetchContacts();
        showNotice("Contact successfully saved to sovereign record");
      }
    } catch (err) {
      console.error("Error adding contact", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to remove this contact from your sovereign record?")) return;

    try {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        if (selectedContact?.id === id) setSelectedContact(null);
        showNotice("Contact removed");
      }
    } catch (err) {
      console.error("Error deleting contact", err);
    }
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleDownloadCsv = () => {
    window.location.href = "/api/contacts/export?format=csv";
    showNotice("Downloading CSV contacts spreadsheet...");
  };

  const handleDownloadVcf = () => {
    window.location.href = "/api/contacts/export?format=vcf";
    showNotice("Downloading Apple & Google vCard address book...");
  };

  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      (c.designation && c.designation.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  const nfcCount = contacts.filter((c) => c.source === "nfc_tap").length;
  const webCount = contacts.filter((c) => c.source === "profile_exchange").length;

  return (
    <div className="space-y-8 text-left max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="font-mono text-xs text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> SOVEREIGN LEADS & CONTACTS
          </span>
          <h1 className="font-cinzel font-medium text-2xl sm:text-3xl text-white tracking-wide mt-1">
            Contacts Management
          </h1>
          <p className="font-sans text-xs text-[#9E9EA8] mt-0.5">
            Track and download contacts received via your physical NFC card tap or digital profile exchange.
          </p>
        </div>

        {/* Download & Add Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCsv}
            className="text-xs rounded-full border-white/20 hover:border-[#0088FF] text-white"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-[#00A2FF]" />
            DOWNLOAD CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadVcf}
            className="text-xs rounded-full border-white/20 hover:border-[#0088FF] text-white"
          >
            <Contact className="w-3.5 h-3.5 mr-1.5 text-[#00A2FF]" />
            DOWNLOAD .VCF
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="text-xs rounded-full tracking-wider"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> ADD CONTACT
          </Button>
        </div>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="p-3 rounded-[12px] bg-[#0055FF]/15 border border-[#0099FF]/40 text-[#A0D4FF] text-xs font-sans flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-[#00A2FF]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#060608] border border-white/[0.08] rounded-[16px] p-5 space-y-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between text-[#8E8E98]">
            <span className="font-mono text-[10px] uppercase tracking-widest">Total Sovereign Leads</span>
            <Users className="w-4 h-4 text-[#00A2FF]" />
          </div>
          <p className="font-sans text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            {contacts.length}
          </p>
          <p className="font-sans text-[11px] text-[#70707C]">Synchronized across cloud records</p>
        </div>

        <div className="bg-[#060608] border border-white/[0.08] rounded-[16px] p-5 space-y-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between text-[#8E8E98]">
            <span className="font-mono text-[10px] uppercase tracking-widest">NFC Contactless Taps</span>
            <Radio className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <p className="font-sans text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            {nfcCount}
          </p>
          <p className="font-sans text-[11px] text-[#70707C]">Physical aerospace card beams</p>
        </div>

        <div className="bg-[#060608] border border-white/[0.08] rounded-[16px] p-5 space-y-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between text-[#8E8E98]">
            <span className="font-mono text-[10px] uppercase tracking-widest">Web / QR Exchanges</span>
            <Download className="w-4 h-4 text-[#70A5FF]" />
          </div>
          <p className="font-sans text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            {webCount}
          </p>
          <p className="font-sans text-[11px] text-[#70707C]">Direct digital profile connections</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#060608] border border-white/[0.08] rounded-[16px] p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-[#62626E] shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, company, title, phone, or email..."
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-[#52525E] focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-[10px] font-mono text-[#8E8E98] hover:text-white px-2 py-1 bg-white/[0.05] rounded"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Contacts Table */}
      <div className="bg-[#060608] border border-white/[0.08] rounded-[16px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-[#0088FF] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-mono text-xs text-[#8E8E98]">Loading sovereign contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="py-16 text-center space-y-4 px-4">
            <Users className="w-10 h-10 text-[#42424E] mx-auto stroke-[1.2]" />
            <div className="space-y-1">
              <h3 className="font-sans font-medium text-base text-white">No contacts found</h3>
              <p className="font-sans text-xs text-[#8E8E98] max-w-sm mx-auto">
                {searchQuery
                  ? "No contacts match your search query."
                  : "Tap your physical NFC card or share your sovereign URL to start receiving contacts."}
              </p>
            </div>
            {!searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddModalOpen(true)}
                className="text-xs rounded-full"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Your First Contact
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[#8E8E98] font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Contact Name</th>
                  <th className="py-3.5 px-4">Organization & Title</th>
                  <th className="py-3.5 px-4">Direct Details</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredContacts.map((c) => {
                  const cleanPhone = (c.phone || "").replace(/[^0-9+]/g, "");
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => setSelectedContact(c)}
                    >
                      {/* Name & Initials */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0055FF]/30 to-[#00A2FF]/20 border border-[#0099FF]/40 text-[#80D0FF] flex items-center justify-center font-cinzel font-semibold text-xs shrink-0">
                            {c.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-sans font-medium text-sm text-white group-hover:text-[#00A2FF] transition-colors">
                              {c.fullName}
                            </p>
                            {c.notes && (
                              <p className="font-sans text-[11px] text-[#70707C] line-clamp-1 max-w-[200px]">
                                {c.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Organization & Designation */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="font-sans text-xs text-[#E2E0DC] flex items-center gap-1.5">
                            <Building className="w-3 h-3 text-[#62626E]" />
                            <span>{c.company || "Independent"}</span>
                          </p>
                          <p className="font-sans text-[11px] text-[#8E8E98]">
                            {c.designation || "Executive"}
                          </p>
                        </div>
                      </td>

                      {/* Direct Phone & Email */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {c.phone && (
                            <p className="font-mono text-[11px] text-[#A0D0FF] flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-[#00A2FF]" />
                              <span>{c.phone}</span>
                            </p>
                          )}
                          {c.email && (
                            <p className="font-sans text-[11px] text-[#A0A0B0] flex items-center gap-1.5 truncate max-w-[180px]">
                              <Mail className="w-3 h-3 text-[#62626E]" />
                              <span>{c.email}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider ${
                            c.source === "nfc_tap"
                              ? "bg-[#0099FF]/15 text-[#00E5FF] border border-[#0099FF]/30"
                              : c.source === "manual"
                              ? "bg-white/[0.05] text-[#D0D0DC] border border-white/10"
                              : "bg-[#0055FF]/15 text-[#80D0FF] border border-[#0055FF]/30"
                          }`}
                        >
                          {c.source === "nfc_tap" ? "NFC Tap" : c.source === "manual" ? "Manual" : "Profile Exchange"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 font-mono text-[11px] text-[#70707C]">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone.replace("+", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                              title="Message on WhatsApp"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                            </a>
                          )}
                          {c.phone && (
                            <a
                              href={`tel:${c.phone}`}
                              className="p-1.5 rounded-full bg-white/[0.05] text-[#D0D0DC] hover:text-white transition-colors"
                              title="Call Phone"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {c.email && (
                            <a
                              href={`mailto:${c.email}`}
                              className="p-1.5 rounded-full bg-white/[0.05] text-[#D0D0DC] hover:text-white transition-colors"
                              title="Send Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            className="p-1.5 rounded-full bg-white/[0.03] text-[#70707C] hover:text-red-400 transition-colors"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Sovereign Contact"
        subtitle="Log a direct contact or lead into your private address book"
      >
        <form onSubmit={handleAddContact} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              placeholder="e.g. Vikram Malhotra"
              className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Apex Capital"
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                Designation / Title
              </label>
              <input
                type="text"
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                placeholder="Managing Director"
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="vikram@apex.io"
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
              Private Notes / Meeting Context
            </label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Met at Global Founders Summit. Interested in corporate metal card tiers..."
              className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] p-3 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF] leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              className="text-xs tracking-wider"
            >
              SAVE CONTACT
            </Button>
          </div>
        </form>
      </Modal>

      {/* Inspect Contact Details Modal */}
      {selectedContact && (
        <Modal
          isOpen={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          title={selectedContact.fullName}
          subtitle={`${selectedContact.designation || "Executive"} · ${selectedContact.company || "Independent"}`}
        >
          <div className="space-y-5 text-left text-xs">
            <div className="space-y-3 bg-[#0A0A0E] border border-white/[0.08] rounded-[14px] p-4">
              {selectedContact.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-[#8E8E98] font-mono text-[11px]">Phone Number:</span>
                  <a href={`tel:${selectedContact.phone}`} className="text-[#00A2FF] font-mono hover:underline">
                    {selectedContact.phone}
                  </a>
                </div>
              )}
              {selectedContact.email && (
                <div className="flex items-center justify-between">
                  <span className="text-[#8E8E98] font-mono text-[11px]">Email Address:</span>
                  <a href={`mailto:${selectedContact.email}`} className="text-white hover:underline">
                    {selectedContact.email}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[#8E8E98] font-mono text-[11px]">Lead Source:</span>
                <span className="text-white uppercase font-mono text-[10px]">
                  {selectedContact.source}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8E8E98] font-mono text-[11px]">Date Logged:</span>
                <span className="text-[#A0A0B0] font-mono text-[11px]">
                  {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString("en-IN") : "—"}
                </span>
              </div>
            </div>

            {selectedContact.notes && (
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] text-[#8E8E98] uppercase tracking-wider">
                  Private Notes:
                </span>
                <p className="p-3.5 rounded-[12px] bg-[#0E0E14] border border-white/[0.08] text-[#D0D0DC] leading-relaxed">
                  {selectedContact.notes}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteContact(selectedContact.id)}
                className="text-xs border-red-500/30 text-red-400 hover:bg-red-950/40"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedContact(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
