"use client";

import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ParticipantsTable from "../components/ParticipantsTable";
import UserPreview from "../components/UserPreview";
import { Participant } from "../types/participant";
import Image from "next/image";

export default function DashboardPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedUser, setSelectedUser] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch all participants from bounty_2025_registrations
  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bounty_2025_registrations")
      .select("*");
    if (error) {
      console.error(error);
      setParticipants([]);
    } else {
      setParticipants(data as Participant[]);
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!selectedUser) return;

    setApproving(true);

    try {
      const { error } = await supabase
        .from("bounty_2025_registrations")
        .update({ approved: true })
        .eq("email", selectedUser.email);

      if (error) {
        toast.error(`Failed to approve: ${error.message}`);
        return;
      }

      // ✅ Send email after successful approval
      await emailjs.send(
        "service_02hek52",
        "template_pr85cvj",
        {
          fullName: selectedUser.full_name_upper,
          email: selectedUser.email,
        },
        "sOTpCYbD5KllwgbCD"
      );

      toast.success("User approved and email sent successfully!");
      await fetchParticipants();
      setSelectedUser((prev) => (prev ? { ...prev, approved: true } : null));
    } catch (err) {
      console.error("Approval error:", err);
      toast.error("Approval failed.");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    setApproving(true);

    const { error } = await supabase
      .from("bounty_2025_registrations")
      .update({ rejected: true })
      .eq("email", selectedUser.email); // ✅ use email instead of id

    if (error) {
      console.error("Reject failed:", error.message);
      toast.error("Failed to reject user.");
    } else {
      toast.success("User rejected successfully!");
      fetchParticipants();
    }

    setApproving(false);
  };

  // 🔍 Adjust filter to use `full_name_upper`
  const filteredParticipants = participants.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.full_name_upper?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.company?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="px-6 py-8">
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/assets/bounty/Bounty LOGO.png"
          alt="Bounty Logo"
          width={290}
          height={0}
          style={{ height: "auto" }}
          priority
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        {/* Search Field */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, or company..."
          className="w-full md:w-2/7 px-4 py-2 border border-[#191919] rounded text-sm text-black"
        />

        <div className="flex gap-8">
          {/* Total Count */}
          <h1 className="text-base lg:text-lg font-semibold text-gray-800">
            Total Number of Participants: {participants.length}
          </h1>
        </div>
      </div>

      {/* Content area */}
      <div className="flex gap-6 h-auto py-2 overflow-hidden">
        <div className={selectedUser ? "w-2/3" : "w-full overflow-y-auto"}>
          <div className="h-full overflow-y-auto">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ParticipantsTable
                data={filteredParticipants}
                onSelect={(user) => setSelectedUser(user)}
                selectedUser={selectedUser}
              />
            )}
          </div>
        </div>

        {selectedUser && (
          <div className="w-1/3 border rounded p-4 bg-[#FEF9DB] shadow-sm h-full overflow-y-hidden">
            <UserPreview
              user={selectedUser}
              onApprove={handleApprove}
              approving={approving}
              onReject={handleReject}
            />
          </div>
        )}
      </div>
    </div>
  );
}
