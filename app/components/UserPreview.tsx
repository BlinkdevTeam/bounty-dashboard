import { useState, useMemo } from "react";
import { Participant } from "../types/participant";

type Props = {
  user: Participant;
  onApprove: () => void;
  onReject: () => void;
  approving: boolean;
  rejecting: boolean; // <-- add separate rejecting state
};

export default function UserPreview({
  user,
  onApprove,
  onReject,
  approving,
  rejecting,
}: Props) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleConfirmApprove = () => {
    setShowApprovalModal(false);
    onApprove();
  };

  const handleConfirmReject = () => {
    setShowRejectModal(false);
    onReject();
  };

  const initials = user.full_name_upper
    ? user.full_name_upper
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
    : "";

  const avatarColors = [
    "bg-[#00072C]",
    "bg-[#0035E6]",
    "bg-[#3EAD35]",
    "bg-[#FEC205]",
    "bg-[#EF1748]",
  ];

  const getColorClass = (key: string) => {
    const sum = key
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatarColors[sum % avatarColors.length];
  };

  const avatarClass = getColorClass(user.full_name_upper || "");

  // Precompute loader color once
  const randomLoaderColor = useMemo(() => {
    const loaderColors = [
      "loader-blue",
      "loader-green",
      "loader-yellow",
      "loader-red",
    ];
    return loaderColors[Math.floor(Math.random() * loaderColors.length)];
  }, []);

  return (
    <div className="flex flex-col justify-between h-full text-sm">
      {/* Top Section */}
      <div className="space-y-4 text-black">
        <div className="flex items-center gap-3">
          <div
            className={`w-14 h-14 rounded-full ${avatarClass} text-white flex items-center justify-center text-xl font-bold border-4 border-white shadow-md`}
          >
            {initials}
          </div>
          <div>
            <p className="font-semibold text-black">{user.full_name_upper}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p>
            <strong>Company:</strong> {user.company || "—"}
          </p>
          <p>
            <strong>Designation:</strong> {user.designation || "—"}
          </p>
          <p>
            <strong>Address:</strong> {user.address || "—"}
          </p>
          <p>
            <strong>Contact Number:</strong> {user.contact_number || "—"}
          </p>
          <p>
            <strong>First Time:</strong> {user.first_time || "—"}
          </p>
          <p>
            <strong>Selected Events:</strong>{" "}
            {user.selected_events?.length
              ? user.selected_events
                  .map((event) => {
                    switch (event) {
                      case "event1":
                        return "Event 1 (September 2, 2025)";
                      case "event2":
                        return "Event 2 (September 3, 2025)";
                      default:
                        return event;
                    }
                  })
                  .join(", ")
              : "—"}
          </p>
        </div>
      </div>

      {/* Approve / Reject Actions */}
      {!user.approved && !user.rejected && (
        <div className="pt-4 flex gap-2">
          {approving || rejecting ? (
            <div className={`loader ${randomLoaderColor} mx-auto`} />
          ) : (
            <>
              <button
                onClick={() => setShowApprovalModal(true)}
                className="bg-[#0035E6] text-white px-4 py-1 rounded w-full cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="bg-[#EF1748] text-white px-4 py-1 rounded w-full cursor-pointer"
              >
                Reject
              </button>
            </>
          )}
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-md p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Confirm Approval
            </h2>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to approve{" "}
              <strong>{user.full_name_upper}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-1 bg-[#0035E6] text-white rounded hover:bg-blue-800 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-md p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Confirm Rejection
            </h2>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to reject{" "}
              <strong>{user.full_name_upper}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1 bg-[#EF1748] text-white rounded hover:bg-red-800 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
